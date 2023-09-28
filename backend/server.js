const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const Razorpay = require("razorpay");
const axios = require('axios');

let razorpay = new Razorpay({
  key_id: "rzp_test_r3o2qLZPBVSn8M",
  key_secret: "WodAVmVcSurVhUsf2OvNYKnM",
});

const app = express();
const PORT = 5000;

// mongoose.connect("mongodb://localhost:27017/myapp", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const userSchema = new mongoose.Schema({
//   username: String,
//   password: String,
//   quillContent: Array,
// });

// const User = mongoose.model("User", userSchema);

// Parse incoming requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const upload = multer();
app.use(upload.any());
app.use(cors()); // Add this line to enable CORS for all routes

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(409).json({ error: "User already exists" });
  }
  // Create a new user instance
  const newUser = new User({
    username,
    password,
  });

  try {
    // Save the user to MongoDB
    await newUser.save();
    res.json({ message: "User saved successfully" });
    const users = await User.find();
  } catch (error) {
    console.error(error, "2 bad");
    res.status(500).json({ error: "An error occurred" });
  }
});

// app.get("/api/register", async (req, res) => {
//   const { username, password } = req.query;
//   try {
//     // Find the user in the database
//     const user = await User.findOne({ username });
//     if (user) {
//       // Check if the password matches
//       if (user.password === password) {
//         res.send("User exists and password is correct");
//       } else {
//         res.send("User exists but password is incorrect");
//       }
//     } else {
//       res.send("User does not exist");
//     }
//   } catch (error) {
//     console.error("Error checking user:", error);
//     res.status(500).send("Error checking user");
//   }
// });


// app.post("/api/register", async (req, res) => {
//   const { username, password } = req.body;
//   console.log("test",username,password);
//   try {
//     // Find the user in the database using Restheart
//     const response = await axios.get(`http://localhost:8080/users?filter={"username":"${username}"}`);
//     console.log("test1",response.data);
//     if (response.data._returned === 1) {
//       const user = response.data._embedded[0];
//       // Check if the password matches
//       if (user.password === password) {
//         res.send("User exists and password is correct");
//       } else {
//         res.send("User exists but password is incorrect");
//       }
//     } else {
//       res.send("User does not exist");
//     }
//   } catch (error) {
//     console.error("Error checking user:", error);
//     res.status(500).send("Error checking user");
//   }
// });

// ... Existing code ...

app.post("/api/save-content", async (req, res) => {
  const { username, content } = req.body;
  try {
    const user = await User.findOne({ username });

    if (user) {
      const delta = JSON.parse(content);

      user.quillContent[0] = delta;

      await user.save();
      res.json({ message: "Content saved successfully" });
    } else {
      console.log("user not dfound");
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error saving content:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/api/get-content", async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ username });

    if (user && user.quillContent.length === 1) {
      const content = user.quillContent[0];
      res.json({ content });
    } else if (user && !user.quillContent.length === 0) {
      res.json({ content: "" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/razorpay", async (req, res) => {

  const payment_capture = 1;
  const amount = req.body.amount;
  const currency = "INR";

  const options = {
    amount: (amount * 100).toString(),
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };
 const response= await razorpay.orders.create(options);
 res.json({
  id:response.id,
  currency: response.currency,
  amount: response.amount,

 })
 console.log(response);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
