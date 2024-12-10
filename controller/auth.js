const model = require("../model/user");
const User = model.User;
var jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

// key collection
const privateKey = fs.readFileSync(
  path.resolve(__dirname, "../private.key"),
  "utf-8"
);

exports.signUp = async (req, res) => {
  const token = jwt.sign({ email: req.body.email }, privateKey, {
    algorithm: "RS256",
  });
  const hash = bcrypt.hashSync(req.body.password, 10);
  try {
    const user = new User(req.body);
    user.token = token;
    user.password = hash;

    const doc = await user.save();
    res.status(201).json(doc);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to save user", details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const doc = await User.findOne({ email: req.body.email });
    const isAuth = bcrypt.compareSync(req.body.password, doc.password);

    if (isAuth) {
      const token = jwt.sign({ email: req.body.email }, privateKey, {
        algorithm: "RS256",
      });
      doc.token = token;
      await doc.save();
      res.status(200).json({ token });
    }
  } catch (err) {
    console.log("what comes here");
    res.status(401).json(err);
  }
};
