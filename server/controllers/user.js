const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer=require('nodemailer');
const axios=require('axios');
const jwt=require('jsonwebtoken');
module.exports.Signup = async (req, res, next) => {
  try {
    const { name, email, password,captchaToken } = req.body;
    if(!name  || !email || !password  || !captchaToken || name==='' || email==='' ||password==='')return res.status(400).json({message:'All fields are required',success:false});
    const secretKey=process.env.SECRET_KEY;
    const recaptchaResponse=await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`);
    console.log(recaptchaResponse);
    if(!recaptchaResponse.data.success){
     return res.status(400).json({ message: "reCAPTCHA failed", success: false });
    }
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ name, email, password });
   
    
    return res
      .status(201)
      .json({ message: "User Sign-up in successfully", success: true });
  } catch (error) {
    console.error(error);
    return res
    .status(500)
    .json({ message:error.message , success: false });
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password,captchaToken } = req.body;
    if (!email || !password   || email==='' || !captchaToken || password==='') {
      return res.json({ message: "All fields are required" });
    }
   const secretKey=process.env.SECRET_KEY;
   const recaptchaResponse=await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`);
   
   if(!recaptchaResponse.data.success){
    return res.status(400).json({ message: "reCAPTCHA failed", success: false });
   }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "Incorrect password or email",
        success: false,
      });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({
        message: "Incorrect password or email",
        success: false,
      });
    }
    const token = jwt.sign({ id:user?._id,isAdmin:user?.isAdmin }, process.env.TOKEN_KEY);
    res.cookie("token", token, {
    
     httpOnly: true,

  maxAge: 86400000, // 24 hours

      
     
      
    
    });
    
    res.status(201).json({
      message: "User logged in successfully",
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user?.profilePicture,
        isAdmin:user?.isAdmin,
        
      },
      token,
    });
 
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error in Login User", success: false });
  }
};

module.exports.updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({message:'You are not allowed to update this user',success:'false'} );
  }
    try{
    if(req.body.password){
      if (req.body.password.length < 6) {
        return res.status(400).json({message:'Password must be at least 6 characters' ,success:false});
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 12);
      req.body.password = hashedPassword;
    }
    if (req.body.name) {
      if (req.body.name.length < 7 || req.body.name.length > 20) {
        return res.status(400).json({message:'Username must be between 7 and 20 characters' ,success:false});

      }
      if (req.body.name.includes(' ')) {
        return res.status(400).json({message:'Username cannot contain spaces' ,success:false});

     
      }
      if (!req.body.name.match(/^[a-zA-Z0-9]+$/)) {
        return res.status(400).json({message:'Username can only contain letters and numbers' ,success:false});

       
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        profilePicture:req.body.profilePicture
      } },
      { new: true }
    );
   
    const {password,...user}=updatedUser._doc;
    return res.status(201).send({
      message: "Profile Updated Successfully",
      success: true,
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error in updating user", error, success: false });
  }
};

module.exports.Logout = (req, res, next) => {
  try {
    res
      .clearCookie("token")
      .status(200)
      .json({ success: true, message: "user logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error in logging out", error, success: false });
  }
};
module.exports.deleteUser = async (req, res) => {

  if (!req.user.isAdmin && req.user.id !== req.params.id) {
    return res.status(403).json({message:'You are not  allowed to delete user'})

  }
  try {
    const id = req.params.id;
        
    const user = await User.findByIdAndDelete(id);
    if (!user)
      return res
        .status(400)
        .json({ message: "User Not Found ", success: false });

    res
     
      .status(200)
      .json({ message: "User Successfully Deleted", success: true,user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in Deleting user ", error, success: false });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user)
      return res
        .status(400)
        .json({ message: "User Not Found ", success: false });
    return res
      .status(200)
      .json({ message: "User Successfully Find", success: true, user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error in Getting user ", error, success: false });
  }
};
module.exports.getUsers = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({message:'You are not  allowed to see all user'})
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);



    const usersWithoutPassword = users.map((user) => {

      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();
  

    const now = new Date();
        
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return res.status(200).json({
      message: "Users getting Success",
      success: true,
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Getting Users Server  Error",
        success: false,
        error,
        
      });
  }
};

//Google Controller

module.exports.Google = async (req, res) => {

  try {
   
    const user = await User.findOne({email:req.body.email});

    if (user){
       const token=jwt.sign({id:user._id,isAdmin:user.isAdmin},process.env.TOKEN_KEY);
       res.cookie('token',token,{
        httpOnly:true,
       }).status(200).json({user});
    }
    else{
      const generatedPassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
      const hashedPassword=await bcrypt.hash(generatedPassword,12);
      const user=await User.create({
        name:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),
        email:req.body.email,
        password:hashedPassword,
        profilePicture:req.body.profilePicture

      })
      
      const token=jwt.sign({id:user._id,isAdmin:user.isAdmin},process.env.TOKEN_KEY);
      res.cookie('token',token,{
       httpOnly:true,
      }).status(200).json({user});
    }
      
    
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error in GOOGLE authentication user ", error, success: false });
  }
};

//forget Password

 module.exports.resetPassword = async (req, res) => {
  const {password,confirmPassword}=req.body;
  if(password!==confirmPassword)      return res.status(400).send({ message: "Passwords do not match " });
 
  // Logic for forget password
  try {
    
    // Verify the token sent by the user
    const decodedToken = jwt.verify(
      req.params.token,
      process.env.FORGET_KEY
    );

    // If the token is invalid, return an error
    if (!decodedToken) {
      return res.status(401).send({ message: "Invalid token" });
    }

    // find the user with the id from the token
    const user = await User.findOne({ _id: decodedToken.id });
    if (!user) {
      return res.status(401).send({ message: "no user found" });
    }
    
    // Hash the new password
    
    const hashedPassword= await bcrypt.hash(password, 12);

    // Update user's password, clear reset token and expiration time
    user.password = hashedPassword;
    const updatedUser=await User.findByIdAndUpdate(decodedToken.id,{password:hashedPassword},{new:true})
    await updatedUser.save();

    // Send success response
    return res.status(200).send({message: "Password updated" });
  } catch (err) {
    // Send error response if any error occurs
   return res.status(500).send({ message: err.message });
  }
};

module.exports.forgetPassword = async (req, res) => {
  // Logic for reset password
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });

    // If user not found, send error message
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Generate a unique JWT token for the user that contains the user's id
    const token = jwt.sign({ id: user._id },process.env.FORGET_KEY, {expiresIn: "10m",});

    // Send the token to the user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_EMAIL,
      },
    });

    // Email configuration
    const mailOptions = {
      from: `Prasu's Blog <${process.env.EMAIL}>`,
      to: req.body.email,
      subject: "Reset Password",
      html: `
    <p>Click on the following link to reset your password:</p>
    <a href="${process.env.FRONTEND_URL}/reset-password/${token}">${process.env.FRONTEND_URL}/reset-password/${token}</a>
    <p>The link will expire in 10 minutes.</p>
    <p>If you didn't request a password reset, please ignore this email.</p>`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      res.status(200).send({ message: "Email sent" });
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};