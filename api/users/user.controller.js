const { createUser, createAdmin, getUserById, getUsers, updateUserPassword, getUserByEmail, addCar, updateCar, deleteCar } = require("./user.service");
const { genSaltSync, hashSync, compareSync } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    createUser(body, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: 0,
          message: "Error with database connection...",
        });
      }
      return res.status(201).json({
        success: 1,
        data: result
      });
    });
  },

  createAdmin: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
  
    createAdmin(body, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: 0,
          message: "Error with database connection...",
        });
      }
      return res.status(201).json({
        success: 1,
        data: result,
      });
    });
  },
  
  getUserById: (req, res) => {
    const id = req.params.id;
    getUserById(id, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: 0,
          message: "Error with database connection...",
        });
      }
      if (!result) {
        return res.status(404).json({
          success: 0,
          message: "User not found",
        });
      }
      return res.status(200).json({
        success: 1,
        data: result,
      });
    });
  },

  getUsers: (req, res) => {
    getUsers((err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: 0,
          message: "Error with database connection..."
        });
      }
      return res.status(200).json({
        success: 1,
        data: result
      });
    });
  },

  updateUserPassword: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    updateUserPassword(body, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: 0,
          message: "Error with database connection..."
        });
      }
      if (!result) {
        return res.status(404).json({
          success: 0,
          message: "Failed to update user password"
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Password changed successfully",
      });
    });
  },

  login: (req, res) => {
    const body = req.body;
    getUserByEmail(body.email, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: 0,
          message: "Error with database connection...",
        });
      }
      if (!result) {
        return res.status(401).json({
          success: 0,
          message: "Invalid email or password",
        });
      }
      const match = compareSync(body.password, result.password);
      if (match) {
        result.password = undefined;
        const jsontoken = sign(
          { userId: result.id, role: result.role },
          process.env.TOKEN_KEY,
          {
            expiresIn: "1h",
          }
        );
        return res.status(200).json({
          success: 1,
          message: "Logged in successfully",
          token: jsontoken,
        });
      } else {
        return res.status(401).json({
          success: 0,
          message: "Invalid email or password",
        });
      }
    });
  },

  addCar: (req, res) => {
    const userId = req.user.userId;
    const carData = req.body;

    addCar(userId, carData, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: 0,
                message: "Error with database connection...",
            });
        }
        return res.status(201).json({
            success: 1,
            message: "Car added successfully",
            data: result
        });
    });
  },

  updateCar: (req, res) => {
    const userId = req.user.userId;
    const carId = req.params.carId;
    const carData = req.body;

    updateCar(userId, carId, carData, (err, result) => {
      if (err) {
        console.error(err);
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
          success: 0,
          message: err.message || "Error with database connection...",
        });
      }
      if (!result) {
        return res.status(404).json({
          success: 0,
          message: "Car not found or failed to update car data",
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Car updated successfully",
      });
    });
  },


  deleteCar: (req, res) => {
    const userId = req.user.userId;
    const carId = req.params.carId;

    deleteCar(userId, carId, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: 0,
                message: "Error with database connection...",
            });
        }
        if (!result) {
          return res.status(404).json({
            success: 0,
            message: "Car doesn't exist"
          });
        }
        return res.status(200).json({
            success: 1,
            message: "Car deleted successfully",
        });
    });
  }
};
