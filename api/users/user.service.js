const pool = require("../../config/db");

module.exports = {
    createUser: (data, callBack) => {
        pool.query(
            `INSERT INTO registration(first_name, second_name, email, mobile_number, password, balance, role)
                        VALUES (?, ?, ?, ?, ?, 100, 'user')`,
            [
                data.first_name,
                data.second_name,
                data.email,
                data.mobile_number,
                data.password
            ],
            (err, res) => {
                if (err) {
                    return callBack(err);
                }
                return callBack(null, res);
            }
        )
    },

    createAdmin: (data, callBack) => {
        pool.query(
            `INSERt INTO registration(first_name, second_name, email, mobile_number, password, role)
                        VALUES (?, ?, ?, ?, ?, 'admin')`,
            [
                data.first_name,
                data.second_name,
                data.email,
                data.mobile_number,
                data.password
            ],
            (err, res) => {
                if (err) {
                    return callBack(err);
                }
                return callBack(null, res);
            }
        )
    },

    getUsers: callBack => {
        pool.query(
            `SELECT id, first_name, second_name, email, mobile_number, balance FROM registration`,
            [],
            (err, res) => {
                if (err) {
                    return callBack(err);
                }
                return callBack(null, res);
            }
        );
    },

    getUserById: (id, callBack) => {
        pool.query(
            `SELECT id, first_name, second_name, email, mobile_number, balance FROM registration WHERE id = ?`,
            [id],
            (err, res) => {
                if (err) {
                    return callBack(err);
                }
                return callBack(null, res[0])
            }
        )
    },

    updateUserPassword: (data, callBack) => {
        pool.query(
            `UPDATE registration SET password = ? WHERE email = ?`,
            [
                data.password,
                data.email
            ],
            (err, res) => {
                if (err) {
                    return callBack(err);
                }
                return callBack(null, res);
            }
        )
    },

    getUserByEmail: (email, callBack) => {
        pool.query(
            `SELECT * FROM registration WHERE email = ?`,
            [email],
            (err, res) => {
                if (err) {
                    return callBack(err);
                }
                return callBack(null, res[0])
            }
        )
    },
    
    addCar: (userId, carData, callBack) => {
        pool.query(
            `INSERT INTO cars (make, model, year, type, plate_number, user_id)
                        VALUES (?, ?, ?, ?, ?, ?)`,
            [
                carData.make,
                carData.model,
                carData.year,
                carData.type,
                carData.plate_number,
                userId
            ],
            (err, res) => {
                if (err) {
                    return callBack(err);
                }
                return callBack(null, res);
            }
        )
    },

    updateCar: (userId, carId, carData, callBack) => {
        pool.query(
          `SELECT * FROM cars WHERE car_id = ? AND user_id = ?`,
          [carId, userId],
          (selectErr, selectRes) => {
            if (selectErr) {
              return callBack(selectErr);
            }
            if (selectRes.length === 0) {
              const notFoundError = new Error("Car not found");
              notFoundError.status = 404;
              return callBack(notFoundError);
            }
            pool.query(
              `UPDATE cars SET make = ?, model = ?, year = ?, type = ?, plate_number = ? WHERE car_id = ? AND user_id = ?`,
              [
                carData.make,
                carData.model,
                carData.year,
                carData.type,
                carData.plate_number,
                carId,
                userId,
              ],
              (updateErr, updateRes) => {
                if (updateErr) {
                  return callBack(updateErr);
                }
                return callBack(null, updateRes);
              }
            );
          }
        );
    },

    deleteCar: (userId, carId, callBack) => {
        pool.query(
            `DELETE FROM cars WHERE car_id = ? AND user_id = ?`,
            [carId, userId],
            (err, res) => {
                if (err) {
                    return callBack(err);
                }
                return callBack(null, res);
            }
        );
    }

}