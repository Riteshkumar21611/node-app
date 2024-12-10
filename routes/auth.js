const express = require("express");
const authController = require("../controller/auth");

const authRouter = express.Router();

authRouter.post("/signUp", authController.signUp);
authRouter.post("/login", authController.login);


exports.authRouter = authRouter;
