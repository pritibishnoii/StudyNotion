const mongoose = require("mongoose");

exports.connectDB = () => {
  try {
    mongoose
      .connect(process.env.MONGO_URL)
      .then(() => {
        console.log(`DATABASE CONNECTED SUCCESSFULLY ..✔️`);
      })
      .catch((err) => {
        console.log(`database connection error --> ${err}`);
        process.exit(1);
      });
  } catch (err) {
    console.log("oops ,, something went wrong..");
  }
};
