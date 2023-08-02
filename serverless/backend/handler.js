const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer=require('multer');
const formidable = require('formidable');

// const {parse}=require('aws-multipart-parser')
const Razorpay = require('razorpay');
const shortid=require('shortid');

const app = express();
// const PORT = 5000; 

// // Serve static files (e.g., CSS, JavaScript, images)
// app.use(express.static(path.join(__dirname, 'static')));

// // Define a catch-all route that serves the main HTML file
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const upload=multer();
app.use(upload.any());
app.use(cors()); // Add this line to enable CORS for all routes


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let razorpayInstance = new Razorpay({ key_id: 'rzp_test_r3o2qLZPBVSn8M', key_secret: 'WodAVmVcSurVhUsf2OvNYKnM' })

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  quillContent:Array,
});


// const User = mongoose.model('User');
const User = mongoose.model('User', userSchema);


module.exports.register = async (event) => {

  
  const { username, password } = JSON.parse(event.body);

      


  // Check if the user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return {
      statusCode: 409,
      body: JSON.stringify({ error: 'User already exists' }),
    };
  }

  // Create a new user instance
  const newUser = new User({
    username,
    password,
  });



  try {
    // Save the user to MongoDB
    await newUser.save();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User saved successfully' }),
    };
  } catch (error) {
    console.error(error,"coudnt save");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred which is not found' }),
    };
  }
};

module.exports.checkUser = async (event) => {
    const { username, password } = event.queryStringParameters;

   const metaData = {
      headers: {
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',

        "Access-Control-Allow-Methods": '*',

        "Access-Control-Allow-Origin": '*',


      },
    };
    try {
  
      // Find the user in the database
      const user = await User.findOne({ username });
      if (user) {
        // Check if the password matches
        if (user.password === password) {
          return {
            ...metaData,
            statusCode: 200,
            body: 'User exists and password is correct',
          };
        } else {
          return {
            ...metaData,
            statusCode: 200,
            body: 'User exists but password is incorrect',
          };
        }
      } else {
        return {
          ...metaData,
          statusCode: 200,
          body: 'User does not exist',
        };
      }
    } catch (error) {
      console.error('Error checking user:', error);
      return {
        ...metaData,
        statusCode: 500,
        body: JSON.stringify('Error checking user'),
      };
    }
};

module.exports.getContent= async event =>{
  try {
    // Extract username from query parameters
    const { username } = event.queryStringParameters;

    // Find user in the MongoDB database
    const user = await User.findOne({ username });

    if (user && user.quillContent.length === 1) {
      // If user is found and has content, respond with the content
      const content = user.quillContent[0];
      return {
        statusCode: 200,
        body: JSON.stringify({ content }),
      };
    } else if (user && user.quillContent.length === 0) {
      // If user is found but has no content, respond with an empty content
      return {
        statusCode: 200,
        body: JSON.stringify({ content: '' }),
      };
    } else {
      // If user is not found, respond with a 404 error
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }
  } catch (error) {
    // If any error occurs during execution, respond with a 500 error
    console.error('Error fetching content:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred' }),
    };
  }

}


module.exports.saveContent = async (event) => {
  try {
    
    const form = new formidable.IncomingForm();
    
    const decodedBody = Buffer.from(event.body, 'base64').toString('utf-8');
    console.log("event",event,{decodedBody})
    // const formData = await new Promise((resolve, reject) => {
    //   form.parse(decodedBody, (err, fields) => {
    //     if (err) return reject(err);
    //     resolve(fields);
    //   });
    // });

    const data={decodedBody};
    const formData = {};
    const boundary = data.decodedBody.match(/------(.*?)\r\n/)[1];
    const parts = data.decodedBody.split(boundary);
  
    for (const part of parts) {
      if (part.includes('Content-Disposition: form-data')) {
        const nameMatch = part.match(/name="(.+?)"/);
        if (nameMatch) {
          const name = nameMatch[1];
          const valueMatch = part.match(/\r\n\r\n(.+?)\r\n/);
          if (valueMatch) {
            formData[name] = valueMatch[1];
          }
        }
      }
    }

    const { username, content } = formData;


      const user = await User.findOne({ username });

      if (user) {
        user.quillContent[0] = JSON.parse(content); // Assuming 'content' is a JSON string from React Quill
        await user.save();

        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Content saved successfully' }),
        };
      } else {
        console.log('User not found');
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'User not found' }),
        };
      }
  } catch (error) {
    console.error('Error saving content:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred' }),
    };
  }
};



module.exports.razorpay = async (event) => {
  const requestBody = JSON.parse(event.body);
  const payment_capture = 1;
  const amount = requestBody.amount;
  const currency = "INR";
  console.log(amount);

  const options = {
    amount: (amount*100).toString(),
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await razorpayInstance.orders.create(options);

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error creating Razorpay order",
      }),
    };
  }
};
