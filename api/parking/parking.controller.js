const { createParkingSpot, getParkingSpots, updateParkingSpotById, deleteParkingSpotById, reserveParkingSpot, freeParkingSpotStatus } = require("./parking.service");

module.exports = {
    createSpot: (req, res) => {
        const body = req.body;
        createParkingSpot(body, (err, result) => {
            if (err) {
                console.error(err);
                const statusCode = err.status || 500;
                return res.status(statusCode).json({
                  success: 0,
                  message: err.message || "Error with database connection...",
                });
            }
            return res.status(201).json({
                success: 1,
                data: result
            });
        });
    },

    getParkingSpots: (req, res) => {
        getParkingSpots((err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: 0,
                    message: "Error with database connection...",
                });
            }
            return res.status(200).json({
                success: 1,
                data: result
            });
        });
    },

    updateParkingById: (req, res) => {
        const body = req.body;
        updateParkingSpotById(body, (err, result) => {
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
                    message: "Failed to update parking data"
                });
            }
            return res.status(200).json({
                success: 1,
                message: "Parking data changed successfully"
            });
        });
    },


    deleteParkingById: (req, res) => {
        const { id } = req.params;
        deleteParkingSpotById({ id }, (err, affectedRows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: 0,
                    message: "Error with database connection..."
                });
            }
            if (affectedRows > 0) {
                return res.status(200).json({
                    success: 1,
                    message: "Parking spot deleted successfully"
                });
            } else {
                return res.status(404).json({
                    success: 0,
                    message: "Parking spot not found or already deleted"
                });
            }
        });
    },

    reserveSpot: (req, res) => {
        const spotId = req.params.id; // Assuming you pass the spot ID in the URL params
        const userId = req.user.userId; // Assuming you have the user's ID in the JWT payload
        const reservationDuration = req.params.duration;
        console.log(reservationDuration)
        reserveParkingSpot(spotId, userId, reservationDuration, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: 0,
                    message: "Error with database connection...",
                });
            }

            if (result.message === "Parking spot reserved successfully") {
                return res.status(200).json({
                    success: 1,
                    message: "Parking spot reserved successfully",
                });
            } else {
                return res.status(400).json({
                    success: 0,
                    message: result.message,
                });
            }
        });
    },

    freeSpot: (req, res) => {
        const spotId = req.params.id;
        
        freeParkingSpotStatus(spotId, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: 0,
                    message: "Error with database connection...",
                });
            }

            if (result.message === "Parking spot freed successfully") {
                return res.status(200).json({
                    success: 1,
                    message: "Parking spot freed successfully",
                });
            } else {
                return res.status(400).json({
                    success: 0,
                    message: result.message,
                });
            }
        });
    },
    
}