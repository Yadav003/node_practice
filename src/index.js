// require("dotenv").config({path :'/.env'});
// import mongoose from "mongoose";
// import { DB_NAME } from "./constant.js";
import express from "express";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config({ path: "./.env" });
if (!process.env.JWT_SECRET) {
  console.warn(
    "Warning: JWT_SECRET is not set. Authentication will fail until you set JWT_SECRET in your .env",
  );
}
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Use user routes
app.use("/api", userRoutes);
// Auth routes (register/login)
app.use("/api/auth", authRoutes);

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
