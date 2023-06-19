const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const Place = require("./models/place");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const { log } = require("console");

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "rhjdke094756rjhrfnn78";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
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

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

//upload by link
app.post("/upload-by-link", async (req, res) => {
  try {
    const { link } = req.body;
    const newName = "photo" + Date.now() + ".jpg";
    await imageDownloader.image({
      url: link,
      dest: __dirname + "/uploads/" + newName,
    });
    res.json(newName);
  } catch (error) {
    res.json(error.message);
  }
});

const photoMiddleware = multer({ dest: "uploads/" });

app.post("/upload", photoMiddleware.array("photos", 100), (req, res) => {
  const files = req.files;
  const uploadedFiles = [];
  files.forEach((element) => {
    const { path, originalname } = element;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);

    uploadedFiles.push(newPath.replace("uploads", ""));
  });
  res.json(uploadedFiles);
});

app.post("/places", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, user) => {
    try {
      if (err) throw err;
      const placeDoc = await Place.create({
        owner: user.id,
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      res.json(placeDoc);
    } catch (error) {
      res.json(error.message);
    }
  });
});

app.get("/userplaces", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, user) => {
    try {
      const placesDocs = await Place.find({ owner: user.id });
      res.json(placesDocs);
    } catch (error) {
      res.json(error.message);
    }
  });
});

app.get("/places/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const placeDoc = await Place.findById(id);
    res.json(placeDoc);
  } catch (error) {
    res.json(error.message);
  }
});

app.put("/places", (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, user) => {
    try {
      if (err) throw err;
      const placeDoc = await Place.findById(id);
      console.log(user.id);
      console.log(placeDoc.owner);
      if (placeDoc.owner.toString() === user.id) {
        placeDoc.set({
          title,
          address,
          photos: addedPhotos,
          description,
          perks,
          extraInfo,
          checkIn,
          checkOut,
          maxGuests,
          price,
        });
        placeDoc.save();
        res.json("ok");
      } else {
        res.json("not authorized to make changes");
      }
    } catch (error) {
      res.json(error.message);
    }
  });
});

app.get("/places", async (req, res) => {
  try {
    res.json(await Place.find());
  } catch (error) {
    res.json(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
