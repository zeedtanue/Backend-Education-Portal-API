const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const { SECRET } = require("../config");

/**
 * @DESC To register the user (ADMIN, SUPER_ADMIN, USER)
 */
const userRegister = (req, res, role) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let profileImage = req.files.profileImage;

  let uploadPath= `public/profile/${req.body.userid}.jpg`;
  
  profileImage.mv( uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

  });

  const password =  bcrypt.hashSync(req.body.userid, 12);

  const product = new User({
    name: req.body.name,
    email: req.body.email,
    role: role,
    userid:req.body.userid,
    password:password,
    profileImage: uploadPath
  });
  product
    .save()
    .then(result => {
      console.log(result);
      
    })
    .catch(err => {
      console.log(err);
      
    });
  }

/**
 * @DESC To Login the user (ADMIN, SUPER_ADMIN, USER)
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
  serializeUser
};
