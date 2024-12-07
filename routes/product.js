const express = require("express");
const productController = require("../controller/product");

const productRouter = express.Router();

productRouter
  .get("/", productController.getAll)
  .get("/:id", productController.getById)
  .post("/", productController.create)
  .put("/:id", productController.replace)
  .patch("/:id", productController.update)
  .delete("/:id", productController.delete);

exports.productRouter = productRouter;
