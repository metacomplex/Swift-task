const { createUser, createAdmin, getUserById, getUsers, updateUserPassword, login, addCar, updateCar, deleteCar } = require("./user.controller");
const router = require("express").Router();
const { checkToken, checkTokenAdmin } = require("../../auth/token_validation")

router.post("/createUser", createUser);
router.post("/createAdmin", checkTokenAdmin, createAdmin);
router.get("/getUser/:id", checkTokenAdmin, getUserById);
router.get("/getUsers", checkTokenAdmin, getUsers);
router.patch("/updatePassword", checkToken, updateUserPassword);
router.post("/login", login)


router.post("/addCar", checkToken, addCar);
router.put("/updateCar/:carId", checkToken, updateCar);
router.delete("/deleteCar/:carId", checkToken, deleteCar);

module.exports = router;