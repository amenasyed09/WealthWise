const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserModel = require('./Models/User');
const incomeModel=require('./Models/Income');
const Expense = require('./Models/Expense'); 
const jwt = require('jsonwebtoken');
const multer=require('multer')
const path=require('path')
const cookieParser = require('cookie-parser');
const { OAuth2Client } = require('google-auth-library'); 
require('dotenv').config();

const app = express();
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
  credentials: true, // ⭐ Allow cookies to be sent
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // File name with timestamp
  },
});
const upload = multer({ storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_SECRET=process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CLIENT_ID=process.env.GOOGLE_CLIENT_ID;
const PORT = process.env.PORT || 5000;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
mongoose.connect(process.env.MONGODB_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) =>  console.error("Error connecting to MongoDB:", err.message));

  

// Helper function to generate JWT token and set cookie
const generateTokenAndSetCookie = (user, res) => {
    const token = jwt.sign({ username: user.username }, JWT_SECRET);
    res.cookie('token', token,{httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000});
    console.log('here to make cookie')
    return token;
  };
  
  app.get('/', (req, res) => {
    console.log('Root route accessed'); // Log when the route is hit
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.send('Api is running');
  });
  
  app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
console.log('here to make user',password)
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ username, email, password: hashedPassword });
        await newUser.save();

       
        const token = generateTokenAndSetCookie(newUser, res);

        res.status(201).json({ message: "Signup successful!", token, user: newUser });
    } catch (error) {
        console.error('Error during signup:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation Error',
                errors: Object.keys(error.errors).reduce((acc, key) => {
                    acc[key] = error.errors[key].message;
                    return acc;
                }, {})
            });
        }

        res.status(500).json({ message: "Error during signup", error: error.message });
    }
});


app.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
   
    
    const foundUser = await UserModel.findOne({ email });

    if (!foundUser) {
      return res.status(400).json({ message: 'Username not found' });
    }
    
    const passwordMatch = bcrypt.compare(password, foundUser.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = generateTokenAndSetCookie(foundUser, res);
  
    return res.status(200).json({ message: 'Signin successful!', token, username: foundUser.username });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

  
app.get('/api/getuser', async (req, res) => {
    const token = req.cookies.token; // JWT for normal users
    const googleToken = req.cookies.googletoken; // Google auth token

    try {
        if (token) {
          jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid token' });
            }
            const username = decoded.username;
            const found= await  UserModel.findOne({username:username})
      
            res.json(found);
        });
          
        } else if (googleToken) {
            const result=jwt.decode(googleToken)
         
            const found= await  UserModel.findOne({email:result.email})
            return res.json(found); // Return the user data
        } else {
            return res.status(401).json({ error: 'No token provided' });
        }
    } catch (error) {
        return res.status(403).json({ error: error.message });
    }
});

app.get('/api/income', async (req, res) => {
  const token = req.cookies.token;
  const googleToken = req.cookies.googletoken;

  let username;

  try {
    // Handle JWT token (for normal users)
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);  // Synchronous JWT verification
      username = decoded.username;
    }
    // Handle Google token (for Google login users)
    else if (googleToken) {
      const decodedGoogleToken = jwt.decode(googleToken);  // Decode Google token
      if (decodedGoogleToken && decodedGoogleToken.name) {
        username = decodedGoogleToken.name;
      } else {
        return res.status(403).json({ error: 'Invalid Google token' });
      }
    } 
    // If no token is provided
    else {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Fetch incomes from the database once username is available
    const incomes = await incomeModel.find({ username: username }).sort({ date: -1 });

    // Return the list of incomes
    return res.json(incomes);

  } catch (error) {
    // Handle any errors (verification or database issues)
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/api/income', async (req, res) => {
  const { title, category, amount, date } = req.body;
  const token = req.cookies.token;
  const googleToken = req.cookies.googletoken;

  let username;

  try {
    // Handle JWT token (for normal users)
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET); // Synchronous JWT verification
      username = decoded.username;
    }
    // Handle Google token (for Google login users)
    else if (googleToken) {
      const decodedGoogleToken = jwt.decode(googleToken); // Decode Google token
      if (decodedGoogleToken && decodedGoogleToken.name) {
        username = decodedGoogleToken.name;
      } else {
        return res.status(403).json({ error: 'Invalid Google token' });
      }
    } 
    // If no token is provided
    else {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Save the income data once username is available
    const newIncome = new incomeModel({
      username: username,
      title: title,
      category: category,
      amount: amount,
      date: date
    });
    
    await newIncome.save();

    // Respond with status 204 (No Content) if successful
    res.sendStatus(204);

  } catch (error) {
    // Handle any errors (verification or database issues)
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an income
app.put('/api/income/:id', async (req, res) => {
  try {
      const income = await incomeModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(income);
  } catch (error) {
      res.status(500).json({ error: 'Failed to update income' });
  }
});

// Delete an income
app.delete('/api/income/:id', async (req, res) => {
  try {
      await incomeModel.findByIdAndDelete(req.params.id);
      res.json({ message: 'Income deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Failed to delete income' });
  }
});
app.delete('/api/logout', (req, res) => {
  console.log('Logout request received');
  console.log(req.cookies.token)
  // Clear the 'token' cookie if it exists
  if (req.cookies.token) {
      res.clearCookie('token',{path:'/'});
      console.log('Token cookie cleared');
  }
  
  // Clear the 'googletoken' cookie if it exists
  if (req.cookies.googletoken) {
      res.clearCookie('googletoken');
      console.log('Google token cookie cleared');
  }
  
  return res.sendStatus(204); // Send a 204 No Content response
});


app.post('/api/expense', async (req, res) => {
  const { title, category, amount, date } = req.body;
  const token = req.cookies.token;
  const googleToken = req.cookies.googletoken;

  let username;

  try {
    // Handle JWT token (for normal users)
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET); // Synchronous JWT verification
      username = decoded.username;
    } 
    // Handle Google token (for Google login users)
    else if (googleToken) {
      const decodedGoogleToken = jwt.decode(googleToken); // Decode Google token
      if (decodedGoogleToken && decodedGoogleToken.name) {
        username = decodedGoogleToken.name;
      } else {
        return res.status(403).json({ error: 'Invalid Google token' });
      }
    } 
    // If no token is provided
    else {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Ensure the user exists
    const foundUser = await UserModel.findOne({ username: username });
    if (!foundUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create and save new expense
    const newExpense = new Expense({
      username,
      title,
      category,
      amount,
      date
    });

    await newExpense.save();

    // Respond with the created expense
    res.status(201).json(newExpense);

  } catch (error) {
    // Handle any errors (JWT verification or database issues)
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all expenses
app.get('/api/expense', async (req, res) => {
  const token = req.cookies.token;
  const googleToken = req.cookies.googletoken;

  let username;

  try {
      // Handle JWT token (for normal users)
      if (token) {
          const decoded = jwt.verify(token, JWT_SECRET); // Verify token synchronously
          username = decoded.username;
      } 
      // Handle Google token (for Google login users)
      else if (googleToken) {
          const decodedGoogleToken = jwt.decode(googleToken); // Decode Google token
          if (decodedGoogleToken && decodedGoogleToken.name) {
              username = decodedGoogleToken.name;
          } else {
              return res.status(403).json({ error: 'Invalid Google token' });
          }
      } 
      // If no token is provided
      else {
          return res.status(401).json({ error: 'No token provided' });
      }

      // Retrieve expenses for the authenticated user
      const expenses = await Expense.find({ username }).sort({ date: -1 });

      // Send the expenses back as a JSON response
      res.json(expenses);

  } catch (error) {
      // Handle any errors (JWT verification or database issues)
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


// Update an expense by ID
app.put('/api/expense/:id', async (req, res) => {
  try {
      const { title, category, amount, date, note } = req.body;
      const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, { title, category, amount, date, note }, { new: true });
      res.json(updatedExpense);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

// Delete an expense by ID
app.delete('/api/expense/:id', async (req, res) => {
  try {
      await Expense.findByIdAndDelete(req.params.id);
      res.sendStatus(204);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});
app.get('/api/filter/income', async (req, res) => {
  const token = req.cookies.token;
  const googleToken = req.cookies.googletoken;

  let username;

  try {
      // Token handling
      if (token) {
          const decoded = jwt.verify(token, JWT_SECRET); // Verify JWT token
          username = decoded.username;
      } 
      else if (googleToken) {
          const decodedGoogleToken = jwt.decode(googleToken); // Decode Google token
          if (decodedGoogleToken && decodedGoogleToken.name) {
              username = decodedGoogleToken.name;
          } else {
              return res.status(403).json({ error: 'Invalid Google token' });
          }
      } 
      else {
          return res.status(401).json({ error: 'No token provided' });
      }

      // Query filter based on the month and year parameters
      const { month, year } = req.query;
      const query = { username: username }; // Filter by authenticated user's username

      if (month && year) {
          const startDate = new Date(year, month - 1, 1);
          const endDate = new Date(year, month, 0);
          query.date = { $gte: startDate, $lt: endDate }; // Filter by date range
      }

      // Fetch filtered incomes
      const incomes = await incomeModel.find(query).sort({ date: -1 }); // Sort by latest first
      res.json(incomes);

  } catch (error) {
      console.error('Error fetching filtered incomes:', error);
      res.status(500).json({ error: 'Error fetching incomes' });
  }
});

app.get('/api/filter/expense', async (req, res) => {
  const token = req.cookies.token;
  const googleToken = req.cookies.googletoken;

  let username;

  try {
      // Token validation
      if (token) {
          const decoded = jwt.verify(token, JWT_SECRET); // Verify JWT token
          username = decoded.username;
      } 
      else if (googleToken) {
          const decodedGoogleToken = jwt.decode(googleToken); // Decode Google token
          if (decodedGoogleToken && decodedGoogleToken.name) {
              username = decodedGoogleToken.name;
          } else {
              return res.status(403).json({ error: 'Invalid Google token' });
          }
      } 
      else {
          return res.status(401).json({ error: 'No token provided' });
      }

      // Filter by date (optional)
      const { month, year } = req.query;
      const query = { username: username }; // Filter by authenticated user's username

      if (month && year) {
          const startDate = new Date(year, month - 1, 1);
          const endDate = new Date(year, month, 0);
          query.date = { $gte: startDate, $lte: endDate }; // Filter by date range
      }

      // Fetch filtered expenses
      const expenses = await Expense.find(query).sort({ date: -1 }); // Sort by latest first
      res.json(expenses);

  } catch (error) {
      console.error('Error fetching filtered expenses:', error);
      res.status(500).json({ error: 'Error fetching expenses' });
  }
});

app.get('/api/summary', async (req, res) => {
  const token = req.cookies.token;
  const googleToken = req.cookies.googletoken;

  let username;

  try {
      // Token validation
      if (token) {
          const decoded = jwt.verify(token, JWT_SECRET); // Verify JWT token
          username = decoded.username;
      } 
      else if (googleToken) {
          const decodedGoogleToken = jwt.decode(googleToken); // Decode Google token
          if (decodedGoogleToken && decodedGoogleToken.name) {
              username = decodedGoogleToken.name;
          } else {
              return res.status(403).json({ error: 'Invalid Google token' });
          }
      } 
      else {
          return res.status(401).json({ error: 'No token provided' });
      }

      // Build the query object based on username and optional date filter
      const { month, year } = req.query;
      const query = { username: username }; // Filter by username

      if (month && year) {
          const startDate = new Date(year, month - 1, 1);
          const endDate = new Date(year, month, 0);
          query.date = { $gte: startDate, $lte: endDate }; // Filter by date range
      }

      // Fetch incomes and expenses in parallel
      const [incomes, expenses] = await Promise.all([
          incomeModel.find(query).sort({ date: -1 }),
          Expense.find(query).sort({ date: -1 })
      ]);

      // Send the summary response
      res.json({
          incomes,
          expenses,
      });

  } catch (err) {
      console.error('Error fetching incomes and expenses:', err);
      res.status(500).json({ error: 'Internal server error' });
  }
});

    app.post('/api/upload', upload.single('profileImage'), async (req, res) => {
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      const token = req.cookies.token;
      const googleToken = req.cookies.googletoken;
      
      let username;
    
      // Handling JWT token (for normal users)
      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET);  // Synchronous JWT verification
          username = decoded.username;
        } catch (err) {
          return res.status(403).json({ error: 'Invalid token' });
        }
      }
      // Handling Google token (for Google login users)
      else if (googleToken) {
        const decodedGoogleToken = jwt.decode(googleToken);  // Decode Google token
        if (decodedGoogleToken && decodedGoogleToken.name) {
          username = decodedGoogleToken.name;
        } else {
          return res.status(403).json({ error: 'Invalid Google token' });
        }
      } else {
        return res.status(401).json({ error: 'No token provided' });
      }
    
      // Proceeding with profile picture update
      try {
        const existingUser = await UserModel.findOne({ username: username });
    
        if (!existingUser) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        console.log('Existing profilePic:', existingUser.profilePic);
        console.log('New imageUrl:', imageUrl);
    
        // Update profile pic only if it's different from the existing one
        if (existingUser.profilePic !== imageUrl) {
          const updateResult = await UserModel.updateOne(
            { username: username },
            { $set: { profilePic: imageUrl } },
            { upsert: true }
          );
          console.log('Update result:', updateResult);
        } else {
          console.log('No changes to update');
        }
    
        res.status(200).json({ url: imageUrl });
      } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
    app.get('/api/savings', async (req, res) => {
      const token = req.cookies.token;
      const googleToken = req.cookies.googletoken;
  
      let username;
  
      try {
          // Token verification
          if (token) {
              const decoded = jwt.verify(token, JWT_SECRET);
              username = decoded.username;
          } else if (googleToken) {
              const decodedGoogleToken = jwt.decode(googleToken);
              if (decodedGoogleToken && decodedGoogleToken.name) {
                  username = decodedGoogleToken.name;
              } else {
                  return res.status(403).json({ error: 'Invalid Google token' });
              }
          } else {
              return res.status(401).json({ error: 'No token provided' });
          }
  
          // Fetch incomes and expenses in parallel
          const [incomes, expenses] = await Promise.all([
              incomeModel.find({ username }),
              Expense.find({ username })
          ]);
  
          // Respond with the savings data
          res.status(200).json({ incomes, expenses });
  
      } catch (err) {
          console.error('Error fetching savings data:', err);
          res.status(500).json({ error: 'Internal server error' });
      }
  });
  
// Google Login Route
app.post('/api/auth/google-login', async (req, res) => {
  const { token } = req.body;

  try {
     
      const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload(); 
      // Check if user already exists in our database
      let user = await UserModel.findOne({ googleId: payload.sub });

      if (!user) {
          // If not, create a new user without a password
          user = new UserModel({
              googleId: payload.sub,
              username: payload.name,
              email: payload.email,
              profilePic: payload.picture,
             
          });

          await user.save(); 
      }

     
      res.status(200).json({ user, message: 'User authenticated successfully' });

  } catch (error) {
      console.error('Error verifying token:', error);
      res.status(401).json({ message: 'Invalid token' });
  }
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});