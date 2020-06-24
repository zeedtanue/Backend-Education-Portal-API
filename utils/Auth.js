const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const Teacher = require("../models/Teacher");
const { SECRET } = require("../config");

/**
 * @DESC To register the user (ADMIN, SUPER_ADMIN, USER)
 */







 
const userRegister = async (userDets, role, res) => {
  try {
    // Validate the userid
    let useridNotTaken = await validateuserid(userDets.userid);
    if (!useridNotTaken) {
      return res.status(400).json({
        message: `userid is already taken.`,
        success: false
      });
    }

    // validate the email
    let emailNotRegistered = await validateEmail(userDets.email);
    if (!emailNotRegistered) {
      return res.status(400).json({
        message: `Email is already registered.`,
        success: false
      });
    }


    


    // Get the hashed password
    const password = await bcrypt.hash(userDets.userid, 12);

    

    // create a new user
    const newUser = new User({
      ...userDets,
      password,
      role
    });

    await newUser.save();
    return res.status(201).json({
      message: "Hurry! now you are successfully registred. Please nor login.",
      success: true
    });
  } catch (err) {
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to create your account.",
      success: false
    });
  }
};


/**
 * @DESC To Login the user (USER, ADMIN, TEACHER,PARENT)
 */
const userLogin = async (userCreds, role, res) => {
  let { userid, password } = userCreds;
  // First Check if the userid is in the database
  const user = await User.findOne({ userid });
  if (!user) {
    return res.status(404).json({
      message: "userid is not found. Invalid login credentials.",
      success: false
    });
  }
  // We will check the role
  if (user.role !== role) {
    return res.status(403).json({
      message: "Please make sure you are logging in from the right portal.",
      success: false
    });
  }
  // That means user is existing and trying to signin fro the right portal
  // Now check for the password
  let isMatch = await bcrypt.compare(password, user.password);
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
};

const teacherLogin = async (userCreds, role, res) => {
  let { userid, password } = userCreds;
  // First Check if the userid is in the database
  console.log(({ userid }));
  const user = await Teacher.findOne({ userid });
  console.log(user)
  if (!user) {
    return res.status(404).json({
      message: "userid is not found. Invalid login credentials.",
      success: false
    });
  }
  // We will check the role
  if (user.role !== role) {
    return res.status(403).json({
      message: "Please make sure you are logging in from the right portal.",
      success: false
    });
  }
  // That means user is existing and trying to signin fro the right portal
  // Now check for the password
  let isMatch = await bcrypt.compare(password, user.password);
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
};




const validateuserid = async userid => {
  let user = await User.findOne({ userid });
  return user ? false : true;
};

/**
 * @DESC Passport middleware
 */
const userAuth = passport.authenticate("jwt", { session: false });

/**
 * @DESC Check Role Middleware
 */
const checkRole = roles => (req, res, next) =>
  !roles.includes(req.user.role)
    ? res.status(401).json("Unauthorized")
    : next();

const validateEmail = async email => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

const serializeUser = user => {
  return {
    userid: user.userid,
    email: user.email,
    name: user.name,
    _id: user._id,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt
  };
};

module.exports = {
  userAuth,
  checkRole,
  userLogin,
  userRegister,
  serializeUser,
  teacherLogin
};
