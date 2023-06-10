const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
//sapp.use(express.urlencoded({ extended: true }));

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

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
