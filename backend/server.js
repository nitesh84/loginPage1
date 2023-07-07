const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000; 

mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});


const User = mongoose.model('User', userSchema);

// Parse incoming requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors()); // Add this line to enable CORS for all routes

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
  

    
      // Check if the user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }
    // Create a new user instance
    const newUser = new User({
      username,
      password,
    });


  
    try {
      // Save the user to MongoDB
      await newUser.save();
      res.json({ message: 'User saved successfully' });
      const users=await User.find();
    //   console.log("All users:",users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });


  app.get('/checkUser', async (req, res) => {
    const { username , password } = req.query;
  console.log(username);
    try {
      // Find the user in the database
      const user = await User.findOne({ username });
  console.log(user);
      if (user) {
        // Check if the password matches
        if (user.password === password) {
          res.send('User exists and password is correct');
        } else {
          res.send('User exists but password is incorrect');
        }
      }

       else {
        res.send('User does not exist');
      }
    } catch (error) {
      console.error('Error checking user:', error);
      res.status(500).send('Error checking user');
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
