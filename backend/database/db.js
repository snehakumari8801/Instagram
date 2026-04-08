const mongoose = require("mongoose");
require("dotenv").config();

exports.dbConnect = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      // useUnifiedTopology: true,
    })
    .then(() => console.log("Mongodb connect successsfully"))
    .catch((error) => console.log(error));
};
