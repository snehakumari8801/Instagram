const User = require("../modals/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../lib/cloudinary");
const nodemailer = require("nodemailer");
const Posts = require("../modals/post");

require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const { name, age, email, password } = req.body;
        const profilePic = req.file ? req.file.filename : null;



    if (!name || !age || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    let userexist = await User.findOne({ email });


    if (userexist) {
      return res.status(401).json({
        message: "user already exist",
      });
    }

    //hash password
    const hashedpassword = await bcrypt.hash(password, 10);

    //create newuser
    const newuser = await User.create({
      name: name,
      age: age,
      email: email,
      password: hashedpassword,
      profilePic:profilePic
    });

    //save in database
    await newuser.save();

    // send response
    return res.status(200).json({
      success:true,
      message: "user register sucessfully",
      data: newuser,
    });
  } catch (error) {
    return res.status(403).json({
      message: "user not register please fix it",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.json({
        success: false,
        message: "Email and Password is required",
      });
    }

    //find
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    //compare password
    if (await bcrypt.compare(password, user.password)) {
      //create token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      user.token = token;
      user.password = undefined;

      let options = {
        expire: new Date(Date.now() * 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      return res.cookie("token", token, options).status(200).json({
        success: true,
        message: "User Login Sucessfully!",
        user,
        token,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only send over HTTPS in prod
    sameSite: "strict",
  });
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

exports.getProtectedData = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to protected route",
    user: req.user, // comes from authMiddleware
  });
};





exports.updateProfile = async (req, res) => {
  try {
    const profilePic = req.file?.path || null; // cloudinary gives URL in .path
    const { userId } = req.params;


    // Validation
    if (!profilePic || !userId) {
      return res.status(400).json({
        message: "User ID and profilePic are required",
      });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: profilePic },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully!",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Profile pic update error:", error);
    return res.status(500).json({
      message: "Error while uploading profile picture",
    });
  }
};

const OTP_EXPIRATION_TIME = Date.now() + 10 * 60 * 1000; // 10 minutes

function sendOtp(to, otp){
  console.log(to,otp)
}

// exports.forgotPassword = async (req,res) => {
//   console.log("call")
//   try{
//     // console.log(req)
//      const {email} = req.body;
//      if(!email){
//       return res.status(404).json({
//         success:false,
//         email:"Email is required"
//       }); }

//       const user = await User.findOne({email:email});

//       if(!user){
//         return res.status(404).json({
//           success:false,
//           message:"User not found"
//         })
//       }

//       //generate 6-digit otp
//       const otp = Math.floor(100000 + Math.random()*900000).toString();

//       //insert otp and exiration in user
//       user.otp = otp;
//       user.otpExpires = OTP_EXPIRATION_TIME;

//       console.log(user);

//       await user.save();

//       sendOtp(email,otp)

//       return res.status(200).json({
//         success:true,
//         mesage:"OTP sent in your email successfully!",
//         otp
//       })
    
//   }catch(error){
//     console.log(error);
//     return res.status(500).json({
//       success:false,
//       message:"Internal Server Error"
//     })
//   }
// }

// exports.verifyOtp = async (req,res) =>{
//   try{
//     const {email,otp} = req.body;


//     if(!email || !otp){
//       return res.status(400).json({
//         success:false,
//         message:"All fields are required"
//       })
//     }

//     const user = await User.findOne({email});


//     if(!user){
//       return res.status(404).json({
//         success:false,
//         message:"User not found"
//       })
//     }

//     if(!user.otp || !user.otpExpires){
//       return res.status(400).json({
//         success:false,
//         message:"OTP not found"
//       })
//     }

//     if(user.otpExpires < Date.now()){
//        return res.status(400).json({
//         success:false,
//         message:"OTP Expire"
//        })
//     }

//     if(user.otp !== otp){
//       return res.status(400).json({
//         success:false,
//         message:"Invalid OTP"
//       })
//     }

//     user.otp = null;
//     user.otpExpires = null;

//     return res.status(200).json({
//       success:false,
//       message:"OTP Verify Successfully!"
//     })
//   }catch(error){
//     console.log(error);
//     return res.status(500).json({
//       success:false,
//       message:error.message
//     })
//   }
// }

// exports.resetPassword = async (req,res) =>{
//   try{
//     const {email, newPassword} = req.body;
//     if(!email || !newPassword){
//       return res.status(400).json({
//         success:false,
//         message:"All fields are required"
//       })
//     };

//     const user = await User.findOne({email});

//     if(!user){
//       return res.status(400).json({
//         success:false,
//         message:"User Not Found"
//       })
//     }

//     // console.log(user)

//     const hashedpassword = await bcrypt.hash(newPassword , 10);
    
//     user.password = hashedpassword;
//     await user.save();

//     return res.status(200).json({
//       success:false,
//       message:"Password set successfully!"
//     })
    
//   }catch(error){
//     console.log(error);
//     return res.status(500).json({
//       success:true,
//       message:error.message
//     })
//   }
// }tokentoken


// exports.forgotPassword = async (req,res) =>{
//   try{
//      const {email} = req.query;
//      console.log(email)

//      const user = await User.findOne({email});

//      const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET,{expiresIn:"1d"});

     
//      const resetLink = `http://localhost:3000/reset-password/${token}`;

//      //send reset link
//      const transporter = nodemailer.createTransport({
//       service:"email",
//       auth:{user:process.env.MAIL_USER , pass:process.env.MAIL_PASS}
//      })

//      await transporter.sendMail({
//       from:process.env.MAIL_USER,
//       to:user.email,
//       subject:`Password Reset Link`,
//       html:`<p>click <a href="${resetLink}">here</a> to reset our password. This Link is Expire in 15 min </p>`
//      })

//      res.status(200).json({
//       success:true,
//       message:"Reset Link send successfully"
//      })
//   }catch(error){
//     console.log(error);
//     res.status(500).json({
//       success:false,
//       message:error.message
//     })
//   }
// }


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.query;

    // Log email for debugging purposes

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate password reset token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // Reset link
    // const resetLink = `http://localhost:3000/reset-password/${token}`;
    const resetLink = `http://192.168.1.6:5173/resetPassword/${token}`;

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",  // Replace with your email provider or SMTP service
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Send password reset email
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "Password Reset Link",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 15 minutes.</p>`,
    });

    // Return success response
    res.status(200).json({
      success: true,
      token:token,
      message: "Reset link sent successfully",
    });
  } catch (error) {
    // Log error stack trace
    console.error(error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.resetPassword = async(req,res) =>{
  try{
    let {token} = req.params;
    const {password} = req.body;

    if(!token && !password){
      return res.status(400).json({
        success:false,
        message:"Token and Password both are required"
      })
    }

    const decoded = jwt.verify(token.toString() , process.env.JWT_SECRET);
    const hashed = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decoded.userId, {password:hashed});

    res.status(200).json({
      success:false,
      message:"Password set successfully"
    })
  }catch(error){
    console.log(error);
  }
}






exports.postImageVideo = async (req, res) => {
  try {
const { userId } = req.body;
    const image = req.files?.image ? req.files.image[0].path : null;
    const video = req.files?.video ? req.files.video[0].path : null;    

    // Validate inputs
    if (!userId || (!image && !video)) {
      return res.status(400).json({
        success: false,
        message: "userId and at least one of image/video are required",
      });
    }

    // Create a new post
    const newPost = new Posts({
      user: userId,
      image,
      video,
      // description,
    });

    await newPost.save();

    // Send success response
    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating post",
      error: error.message,
    });
  }
};


exports.getAllPosts = async (req,res)=>{
  try{
    const posts = await Posts.find({}).populate("user", "name profilePic"); // populate only username field


    if(!posts){
      return res.status(400).json({
        success:false,
        mesage:"Posts are  not available",
      })
    }

    return res.status(200).json({
      success:true,
      message:"Fetch all posts successfully!",
      posts
    })
  }catch(error){
    console.log(error);
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }
}


// exports.likePost = async (req,res) =>{
//   try{
//      const postId = req.params;
//      const userId = req.user._id;

//      if(!userId || !postId){
//       return res.status(400).json({
//         success:false,
//         message:"All fields are required"
//       })
//      }

//      if(!mongoose.Types.ObjectId.isValid(postId)){
//         return res.status(401).json({
//           success:false,
//           message:"Invalid post Id"
//         })
//      }

//      const posts = await Posts.find(postId);

//      if(!posts){
//       return res.status(404).json({
//         success:false,
//         message:"Don't found posts for this id"
//       })
//      }

//      return 
//   }catch(error){
//     console.log(error);
//     return res.status(500).json({
//       success:false,
//       message:error.message
//     })
//   }
// }


exports.likePost = async (req,res) =>{
  try{
    const userId = req.user.userId;
    const {postId} = req.params;

    console.log(userId,postId)

    if(!userId || !postId){
      return res.status(400).json({
        success:false,
        message:"All fields are required"
      })
    }

    const posts = await Posts.findOne({_id:postId});

    if(!posts){
      return res.status(404).json({
        success:false,
        message:"Post Not Found"
      })
    }

    const alreadyLike = posts.likes.includes(userId);

    if(alreadyLike){
      posts.likes = posts.likes.filter((post)=>post.toString() !== userId)
    }else{
      posts.likes.push(userId);
    }

    await posts.save();

    return res.status(200).json({
      success:true,
      liked: !alreadyLike,
      likes:posts.likes,
      likeCount:posts.likes.length
    })
  }catch(error){
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}



