const User = require('../models/User');
const Book = require('../models/Book');
const Parent = require('../models/Parents');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");

exports.login= async (req, role, res) => {
    
    const user =await User.findOne({userid: req.body.userid});

    if (!user) {
        return res.status(404).json({
          message: "userid is not found. Invalid login credentials.",
          success: false
        });
      }
    if(user.role !=='student'){
        return res.status(404).json({
            message: "userid is not found. Invalid login credentials.",
            success: false
          });
    }
    let isMatch = await bcrypt.compare(req.body.password, user.password);
    if (isMatch) {
      // Sign in the token and issue it to the user
      let token = jwt.sign(
        {
          user_id: user._id,
          role: user.role,
          userid: user.userid,
          email: user.email
        },
        SECRET,
        { expiresIn: "7 days" }
      );
  
      let result = {
        userid: user.userid,
        role: user.role,
        email: user.email,
        token: `Bearer ${token}`,
        expiresIn: 168
      };
  
      return res.status(200).json({
        ...result,
        message: "Hurray! You are now logged in.",
        success: true
      });
    } else {
      return res.status(403).json({
        message: "Incorrect password.",
        success: false
      });
    }
    
  //let { req.body.userid, password } = userCreds;
  // First Check if the userid is in the database
  /*
  const user = await User.findOne( req.body.userid );
  if (!user) {
    return res.status(404).json({
      message: "userid is not found. Invalid login credentials.",
      success: false
    });
  }
  // We will check the role
  /*
  if (user.role !== role) {
    return res.status(403).json({
      message: "Please make sure you are logging in from the right portal.",
      success: false
    });
  }
  // That means user is existing and trying to signin fro the right portal
  
  // Now check for the password
  


  let isMatch = await bcrypt.compare(req.body.password, user.password);
  if (isMatch) {
    // Sign in the token and issue it to the user
    let token = jwt.sign(
      {
        user_id: user._id,
        role: user.role,
        userid: user.userid,
        email: user.email
      },
      SECRET,
      { expiresIn: "7 days" }
    );

    let result = {
      userid: user.userid,
      role: user.role,
      email: user.email,
      token: `Bearer ${token}`,
      expiresIn: 168
    };

    return res.status(200).json({
      ...result,
      message: "Hurray! You are now logged in.",
      success: true
    });
  } else {
    return res.status(403).json({
      message: "Incorrect password.",
      success: false
    });
  } */
};