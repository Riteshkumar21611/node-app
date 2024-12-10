require("dotenv").config();
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const { productRouter } = require("./routes/product");
const cors = require("cors");
const path = require("path");
const { userRouter } = require("./routes/user");
const jwt = require("jsonwebtoken");
const { authRouter } = require("./routes/auth");
const fs = require("fs");

const publicKey = fs.readFileSync(
  path.resolve(__dirname, "./public.key"),
  "utf-8"
);

// Establish connection with the database
main().catch((err) => console.log("Database connection error:", err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Connected to the database");
}

// middleware for authentication
const auth = (req, res, next) => {
  try {
    const token = req.get("Authorization")?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).send("Unauthorized");
    }
    const decoded = jwt.verify(token, publicKey);
    if (decoded?.email) {
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    res.status(401).send("Invalid or expired token");
  }
};

// Middleware setup
server.use(cors());
server.use(express.json());
server.use(express.urlencoded());

// Routers
server.use("/auth", authRouter);
server.use("/products", auth, productRouter);
server.use("/users", auth, userRouter);

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
