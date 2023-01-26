const app = require("./app");
const connectWithDb = require("./config/db");
const cloudinary = require("cloudinary");
require("dotenv").config();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// DB CONNECTION (Mongoose)
connectWithDb();

app.listen(process.env.PORT, () => {
  console.log(`Server is running at PORT: ${process.env.PORT}`);
});
