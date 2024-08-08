const express = require("express");

// create the instance of express
const app = express();

const cors = require("cors")
const cookieParser = require("cookie-parser");
require("dotenv").config();

const PORT = process.env.PORT || 4000;
// add middlewar
// parse the json
app.use(express.json());


// add npm i cookie-parser
app.use(cookieParser())


// add cors

app.use(
	cors({
		// origin: "*",
		origin: "https://localhost:3000",
		credentials: true,
	})
);
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
// TODO user Routes
const userRoutes = require("./routes/user");
app.use("/api/v1/auth", userRoutes);

// TODO Profile Routes
const profileRoutes = require("./routes/profile");
app.use("/api/v1/profile", profileRoutes);

// TODO Course Routes
const courseRoutes = require("./routes/course");
app.use("/api/v1/course", courseRoutes);

// TODO Contact Routes
const contactUsRoute = require("./routes/contact");
app.use("/api/v1/contact", contactUsRoute);