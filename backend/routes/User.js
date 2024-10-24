const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); 
const jwt = require('jsonwebtoken');
const authenticateUser = require('./userAuth');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    

    // Validate username length
    if (username.length < 3 || username.length > 20) {
        return res.status(400).json({ message: 'Username must be between 3 and 20 characters long.' });
      }
  
    // Validate password length
    if (password.length < 6 || password.length > 30) {
       return res.status(400).json({ message: 'Password must be between 6 and 30 characters long.' });
    }

  
    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Check if email already exists
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      address
    });

    // Save user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error!!!', error });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;


    // Check if user exists with the provided email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }


    // Compare the password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password,(error,data)=>{

      if (data){

        const authClaims = [{name:user.username},{role:user.role}]

        // Generate a JWT token
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.SECRET, 
          { expiresIn: '30d' }
        );

        // Send the token as a response
        res.status(200).json({
          id:user._id,
          role:user.role,
          token:token,
        });
      }else{
        return res.status(400).json({ message: 'Invalid email or password.' });  
      }


    });

    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/getuserinfo', authenticateUser,async (req, res) => {
  try {
    const {id} = req.headers;
    const user = await User.findById(id).select("-password");
    if(user.role !== "admin")
    {   
        return res.status(400).json({ message: 'Admin privilege required for this operation !'});    
    }
    
    return res.status(200).json(user);

    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


router.put('/updaterole', authenticateUser,async (req, res) => {
  try {

    const {id}      = req.headers;
    const { role } = req.body; 
    user=await User.findById(id);
    if(user.role !== "admin")
    {   
        return res.status(400).json({ message: 'Admin privilege required for this operation !'});    
    }
    existingUser = await User.findByIdAndUpdate(id,{role:role});
    return res.status(200).json({"message":"User Updated successfully"});

    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
