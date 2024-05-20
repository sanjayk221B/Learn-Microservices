const express = require("express");
const app = express();
const User = require("./User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const PORT = process.env.PORT_ONE || 7070;

mongoose.connect("mongodb://localhost/auth-service", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Auth-Service DB Connected");
});

app.use(express.json());

// =========Login========
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "User doesn't exist" });
  } else {
    //Checking if the entered password is valid
    if (password !== user.password) {
      return res.json({ message: "Incorrect Password" });
    }

    const payload = {
      email,
      name: user.name,
    };
    jwt.sign(payload, "secret", (err, token) => {
      if (err) console.log(err);
      else {
        return res.json({ token: token });
      }
    });
  }
});

// =========Register========
app.post("/auth/register", async (req, res) => {
  const { email, password, name } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.json({ message: "User already exists" });
  } else {
    const newUser = new User({
      name,
      email,
      password,
    });
    newUser.save();
    return res.json(newUser);
  }
});

app.listen(PORT, () => {
  console.log(`Auth-Service at ${PORT}`);
});
