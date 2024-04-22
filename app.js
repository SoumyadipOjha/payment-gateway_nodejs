const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path"); // Import the path module
const dotenv = require("dotenv");
dotenv.config();
const MONGODB_URI = process.env.MONGODB_CONNECT_URI;

app.use(bodyParser.urlencoded({ extended: true }));

// Specify the path to serve static files from the root directory
app.use(express.static(path.join(__dirname, "")));

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const paymentSchema = new mongoose.Schema({
  amount: { type: String, required: true },
  nameOnCard: { type: String, required: true },
  cardNumber: { type: String, required: true },
});

const Payment = mongoose.model("Payment", paymentSchema); // Adjust the model name

// Serve paymentPage.html on root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/paymentPage.html"));
});

// Serve the CSS file
app.get("/style.css", (req, res) => {
  res.sendFile(path.join(__dirname, "/style.css"));
});

app.post("/paymentPage", (req, res) => {
  const adder = new Payment({
    amount: req.body.amount,
    nameOnCard: req.body.nameOnCard,
    cardNumber: req.body.cardNumber,
  });

  adder
    .save()
    .then(() => {
      console.log("Payment details saved successfully");
      res.sendFile(path.join(__dirname, "/successPage.html"));
    })
    .catch((err) => {
      console.error("Error saving payment details:", err);
      res.status(500).send("Error saving payment details");
    });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
