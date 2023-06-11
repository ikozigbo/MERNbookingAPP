const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "rhjdke094756rjhrfnn78";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.urlencoded({ extended: true }));

const DB = process.env.DB;
const PORT = process.env.PORT;

mongoose
  .connect(DB)
  .then(() => {
    console.log(`connected to ${DB}`);
  })
  .catch((e) => {
    console.log(e.message);
  });

app.get("/test", (req, res) => {
  res.json("ok");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });

    res.json(userDoc);
  } catch (error) {
    res.status(422).json({ message: error });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    userDoc = await User.findOne({ email });
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign(
          { email: userDoc.email, name: userDoc.name, id: userDoc._id },
          jwtSecret,
          {},
          (err, token) => {
            if (err) {
              throw err;
            } else {
              res.cookie("token", token).json({
                id: userDoc._id,
                name: userDoc.name,
                email: userDoc.email,
              });
            }
          }
        );
      } else {
        res.status(400).json("wrong credentials");
      }
    } else {
      res.status(422).json("wrong credentials");
    }
  } catch (error) {}
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, user) => {
      if (err) throw err;
      res.json(user);
    });
  } else {
    res.json(null);
  }
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
