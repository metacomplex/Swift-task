const { createSpot, getParkingSpots, updateParkingById, deleteParkingById, reserveSpot, freeSpot } = require("./parking.controller");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation")

router.post("/createSpot", checkToken, createSpot);
router.get("/getSpots", checkToken, getParkingSpots);
router.patch("/updateSpot", checkToken, updateParkingById);
router.delete("/deleteSpot/:id", checkToken, deleteParkingById);
router.post("/reserveSpot/:id/:duration", checkToken, reserveSpot);
router.post("/freeSpot/:id", checkToken, freeSpot);
module.exports = router;