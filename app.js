require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan"); // Untuk menampilkan Method dan url di TERMINAL
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload"); // Digunakan untuk upload file

// Swegger
const swagger = require("swagger-ui-express");
const YAML = require("yamljs");
const SwaagerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swagger.serve, swagger.setup(SwaagerDocument));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// ejs
app.set("view engine", "ejs");

// Morgan Middleware
app.use(morgan("tiny"));

// Routes Middleware
const home = require("./routes/home");
const user = require("./routes/user");

app.use("/api/v1", home);
app.use("/api/v1", user);

app.use("/signuptest", (req, res) => {
  res.render("signup.ejs");
});

module.exports = app;
