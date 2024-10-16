// // const mongodb = require("mongodb");
// const mongoose = require("mongoose");
// // const mongoClient = mongodb.MongoClient;
// const connectionUrl = "mongodb://127.0.0.1:27017/lec-12";
// mongoose.connect(connectionUrl);

// const Car = mongoose.model("Car", { type: String });

// const car1 = new Car({ type: "audi" });

// car1
//   .save()
//   .then(() => {
//     console.log("car added");
//   })
//   .catch((err) => {
//     console.error("error founded : ", err);
//   });
///////////////////////////////////////////////////////////////
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

//to parse automatically
app.use(express.json());

// connsect db , require mongoose file
require("./db/mongoose"); // handle connection

// require routers
app.use(require("./routers/user"));
app.use(require("./routers/task"));


app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
