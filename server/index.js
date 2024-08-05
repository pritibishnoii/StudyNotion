const express = require("express");

// create the instance of express
const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 4000;
// add middlewar
// parse the json
app.use(express.json());

// file upload  -- upload the file over the server
const fileUpload = require("express-fileupload");

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// connect to the cloud
const cloudinary = require("./config/cloudinary");
// call the cloudinaryConnect()
cloudinary.cloudinaryConnect();

// connect to the db
const database = require("./config/database");
database.connectDB();

app.listen(PORT, () => {
  console.log(`server is started at PORT ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("welcome ....");
});

// Setting up routes
const userRoutes = require("./routes/user");
app.use("/api/v1/auth", userRoutes);
