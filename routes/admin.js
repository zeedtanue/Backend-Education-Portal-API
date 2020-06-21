const router = require("express").Router();
// Bring in the User Registration function

const User =require('../models/User');
const mongoose= require ('mongoose');



const {
  userAuth,
  userLogin,
  checkRole,
  userRegister,
  serializeUser
} = require("../utils/Auth");
const adminController =require("../controllers/admin")

const commonController =require("../controllers/commonController");





router.get("/", function(req, res, next) {
  res.render('index', { title: 'Admin' });
})

//post requests
//Register users
// student Registeration Route
router.post("/register-student", commonController.registerStudent);

// teacher Registration Route
router.post("/register-teacher", commonController.registerTeacher);

// PARENTS Route
router.post("/register-parent", commonController.registerParent);

// Admin Registration Route
router.post("/register-admin", commonController.registerUser)


router.post('/upload-demo',function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let sampleFile = req.files.sampleFile;
  console.log(req.files.sampleFile.data)
  sampleFile.mv('public/profile/filename.jpg', function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});

// Admin Login Route
router.post("/login", async (req, res) => {
  await userLogin(req.body, "admin", res);
});


//Get requests
//get users
// Profile Route
router.get("/profile", userAuth, async (req, res) => {
  return res.json(serializeUser(req.user));
});

//All the profile get
router.get("/users",userAuth, adminController.getAllUsers);



//Delete
router.delete("/users/:id", userAuth,checkRole(["admin"]), adminController.deleteUser)

//admin change password
router.put("/change-password/:id", 
            userAuth,
            checkRole(["teacher"]), 
            commonController.changePasword);


//Book
//Book upload
router.post("/upload-book", userAuth, checkRole(["admin"]), adminController.uploadBook);
//Get books list
router.get("/books",userAuth, checkRole(["admin"]), commonController.getAllBooks);
//Edit Books
router.put("/edit-book/:id",userAuth, checkRole(["admin"]), adminController.editBook);



//Admin Protected Route
router.get(
  "/admin-protectd",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    return res.json("Hello Admin");
  }
);

// Admin & teacher Protected Route
router.get(
  "/admin-and-teacher-protectd",
  userAuth,
  checkRole(["admin", "teacher"]),
  async (req, res) => {
    return res.json("Admin and Teacher");
  }
);


module.exports = router;
