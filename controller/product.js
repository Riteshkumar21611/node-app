const model = require("../model/product");
const Product = model.Product;
const ejs = require("ejs");
const path = require("path");
exports.getProductSSR = async (req,res) => {
  try {
    const products = await Product.find();
    ejs.renderFile(
      path.resolve(__dirname, "../pages/index.ejs"),
      { products: products},
      function (err, str) {
        if (err) {
          console.error("EJS render error:", err);
          return res.status(500).send("Server error.");
        }
        res.send(str);
      }
    );
    
  } catch (err) {
    console.log(err.message,`,<<<<<<<<<<<<<<<<<<`)
  }
};

exports.getFormSSR=async(req,res)=>{
  ejs.renderFile(
    path.resolve(__dirname, "../pages/add.ejs"),
   
    function (err, str) {
      if (err) {
        console.error("EJS render error:", err);
        return res.status(500).send("Server error.");
      }
      res.send(str);
    }
  );


}

// CREATE
exports.create = async (req, res) => {
  try {
    const product = new Product(req.body);
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to save product", details: err.message });
  }
};

//   READ
exports.getAll = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch products", details: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    res
      .status(500)
      .json({ error: "Failed to fetch product", details: err.message });
  }
};

exports.replace = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await Product.findOneAndReplace({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(doc);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    res
      .status(500)
      .json({ error: "Failed to replace product", details: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await Product.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!doc) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(doc);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    res
      .status(500)
      .json({ error: "Failed to update product", details: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await Product.findByIdAndDelete(id);

    if (!doc) {
      return res.status(404).json({ error: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Product deleted successfully", data: doc });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    res
      .status(500)
      .json({ error: "Failed to delete product", details: err.message });
  }
};
