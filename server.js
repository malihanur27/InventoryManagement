const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/products", productRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed:");
    console.log(error.message);
  });
