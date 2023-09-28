const pool = require("../../config/db");

module.exports = {
    createParkingSpot: (data, callBack) => {
        const now = new Date();
      
        pool.query(
          `SELECT COUNT(*) AS count FROM parking WHERE address = ?`,
          [data.address],
          (selectErr, selectRes) => {
            if (selectErr) {
              return callBack(selectErr);
            }
      
            const addressCount = selectRes[0].count;
      
            if (addressCount > 0) {
              const addressError = new Error("Address is not unique.");
              addressError.status = 400;
              return callBack(addressError);
            }
      
            pool.query(
              `INSERT INTO parking(zone_name, address, price_per_hour, taken, created_at, updated_at, user_id)
               VALUES(?, ?, ?, false, ?, ?, null)`,
              [
                data.zone_name,
                data.address,
                data.price_per_hour,
                now,
                now,
              ],
              (insertErr, insertRes) => {
                if (insertErr) {
                  return callBack(insertErr);
                }
                return callBack(null, insertRes);
              }
            );
          }
        );
      },

    getParkingSpots: callBack => {
        pool.query(
            `SELECT id, zone_name, address, price_per_hour, taken, created_at, updated_at FROM parking`,
            [],
            (err, res) => {
                if (err) {
                    return callBack(err);
                }
                return callBack(null, res);
            }
        )
    },
    

    updateParkingSpotById: (data, callBack) => {
        const now = new Date();
        pool.query(
            `UPDATE parking SET zone_name = ?, address = ?, price_per_hour = ?, taken = ?, updated_at = ? WHERE id = ?`,
            [
                data.zone_name,
                data.address,
                data.price_per_hour,
                data.taken,
                now,
                data.id,
            ],
            (err, res) => {
                if (err) {
                    return callBack(err);
                }
                return callBack(null, res)
            }
        )
    },


    deleteParkingSpotById: (data, callBack) => {
        pool.query(
            `DELETE FROM parking WHERE id = ?`,
            [data.id],
            (err, res) => {
                if (err) {
                    return callBack(err);
                }
                return callBack(null, res.affectedRows);
            }
        )
    },

    reserveParkingSpot: (spotId, userId, reservationDuration, callBack) => {
      const now = new Date();

      pool.query(
          `SELECT * FROM parking WHERE id = ? AND taken = false`,
          [spotId],
          (err, spotResult) => {
              if (err) {
                  return callBack(err);
              }

              if (spotResult.length === 0) {
                  return callBack(null, { message: "Parking spot is already taken" });
              }

              const pricePerHour = spotResult[0].price_per_hour;
              const reservationCost = pricePerHour * reservationDuration;

              pool.query(
                  `SELECT balance FROM registration WHERE id = ?`,
                  [userId],
                  (err, userResult) => {
                      if (err) {
                          return callBack(err);
                      }

                      const userBalance = userResult[0].balance;

                      if (userBalance < reservationCost) {
                          return callBack(null, { message: "Insufficient balance" });
                      }

                      const updatedBalance = userBalance - reservationCost;
                      console.log(reservationCost, userBalance)
                      pool.query(
                          `UPDATE registration SET balance = ? WHERE id = ?`,
                          [updatedBalance, userId],
                          (err) => {
                              if (err) {
                                  return callBack(err);
                              }

                              pool.query(
                                  `UPDATE parking SET user_id = ?, taken = true WHERE id = ?`,
                                  [userId, spotId],
                                  (err) => {
                                      if (err) {
                                          return callBack(err);
                                      }

                                      return callBack(null, { message: "Parking spot reserved successfully" });
                                  }
                              );
                          }
                      );
                  }
              );
          }
      );
    },

    freeParkingSpotStatus: (spotId, callBack) => {
      pool.query(
        `UPDATE parking SET taken = ? WHERE id = ?`,
        [false, spotId],
        (err, res) => {
          if (err) {
            return callBack(err);
          }
          return callBack(null, { message: "Parking spot freed successfully" });
        }
      );
    },
}