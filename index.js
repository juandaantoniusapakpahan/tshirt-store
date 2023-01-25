const app = require("./app");
const connectWithDb = require("./config/db");
require("dotenv").config();

// DB CONNECTION (Mongoose)
connectWithDb();

app.listen(process.env.PORT, () => {
  console.log(`Server is running at PORT: ${process.env.PORT}`);
});
