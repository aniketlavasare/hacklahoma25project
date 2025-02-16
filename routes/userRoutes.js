const User = require("../models/user");

function signup(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newUser = new User({ email, password });

  newUser.save((err, user) => {
    if (err) {
      return res.status(500).json({ error: "Error creating user" });
    }

    res.status(201).json({ message: "User created successfully", user });
  });
}

function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  User.findOne({ email, password }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Error finding user" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User found", user });
  });

}

function logout(req, res) {
    
}


module.exports = {
  signup,
  login,
  logout,
};