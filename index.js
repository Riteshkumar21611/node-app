require("dotenv").config();
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const { productRouter } = require("./routes/product");
const cors = require("cors");
const path = require("path");

// Establish connection with the database
main().catch((err) => console.log("Database connection error:", err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Connected to the database");
}

// Middleware setup
server.use(cors());
server.use(express.json());

// Routers
server.use("/api/products", productRouter);
// Serve static files
server.use(express.static(path.resolve(__dirname, process.env.PUBLIC_DIR)));

// Fallback for SPA routing
server.use("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, process.env.PUBLIC_DIR, "index.html"));
});

// Start the server
server.listen(process.env.PORT, () => {
  console.log("Server started on port", process.env.PORT);
});
