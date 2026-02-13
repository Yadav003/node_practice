// require("dotenv").config({path :'/.env'});
// import mongoose from "mongoose";
// import { DB_NAME } from "./constant.js";
import express from "express";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({path: './.env'});
const app = express();


connectDB()
.then(() => {
  app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.log("Error DB connection failed...... ", err);
});



// const app = express();
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

//     app.on(
//       ("error",
//       (error) => {
//         console.log("Error", error);
//       }),
//     );

//     app.listen(process.env.PORT, () => {
//       console.log(`Server is running on port ${process.env.PORT}`);
//     });

//   } catch (error) {
//     console.log("Error DB Not connected ", error);
//     throw error;
//   }
// })();
