const express = require("express");
const userController = require("../controller/user");

const userRouter = express.Router();

userRouter
  .get("/", userController.getAll)
  .get("/:id", userController.getById)
  .put("/:id", userController.replace)
  .patch("/:id", userController.update)
  .delete("/:id", userController.delete);

exports.userRouter = userRouter;
