const pool = require("../../config/db");

module.exports = {
    createParkingSpot: (data, callBack) => {
        const now = new Date();
      
        // Check if the address already exists in the database
        pool.query(
          `SELECT COUNT(*) AS count FROM parking WHERE address = ?`,
          [data.address],
          (selectErr, selectRes) => {
            if (selectErr) {
              return callBack(selectErr);
            }
      
            const addressCount = selectRes[0].count;
      
            if (addressCount > 0) {
              // Address already exists, return an error message
              const addressError = new Error("Address is not unique.");
              addressError.status = 400; // You can use an appropriate status code (e.g., 400 Bad Request)
              return callBack(addressError);
            }
      
            // Address is unique, proceed with the insert
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
    }
}