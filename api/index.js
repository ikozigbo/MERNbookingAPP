const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const cors = require("cors");
require("dotenv").config();

const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();
app.use(express.json());
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
    res.json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
