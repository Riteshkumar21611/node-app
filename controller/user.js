const model = require("../model/user");
const User = model.User;

//   READ
exports.getAll = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch users", details: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    res
      .status(500)
      .json({ error: "Failed to fetch users", details: err.message });
  }
};

exports.replace = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await User.findOneAndReplace({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(doc);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    res
      .status(500)
      .json({ error: "Failed to replace user", details: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!doc) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(doc);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    res
      .status(500)
      .json({ error: "Failed to update user", details: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await User.findByIdAndDelete(id);

    if (!doc) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", data: doc });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    res
      .status(500)
      .json({ error: "Failed to delete user", details: err.message });
  }
};
