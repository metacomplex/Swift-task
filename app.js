const express = require('express');
require('dotenv').config();
const userRouter = require("./api/users/user.router");
const parkingRouter = require("./api/parking/parking.router");

const app = express();

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/parking", parkingRouter);

app.listen(process.env.PORT, () => {
    console.log("Server in runing on:", process.env.PORT);
});