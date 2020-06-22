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
router.post("/register-admin", commonController.registerAdmin)


// Admin Login Route
router.post("/login", async (req, res) => {
  await userLogin(req.body, "admin", res);
});


//Get requests
//get users
// Profile Route
router.get("/profile",  async (req, res) => {
  console.log(id);
  return res.json(serializeUser(req.user));
});

//All the profile get
router.get("/user", adminController.getAllUser);
//Get specific profile
router.get("/user/:id", adminController.getUser);
//Delete
router.delete("/user/:id", userAuth,checkRole(["admin"]), adminController.deleteUser)

//admin change password
router.put("/change-password/:id", 
            userAuth,
            checkRole(["teacher"]), 
            commonController.changePasword);


//Book
//Book upload
router.post("/upload-book",  adminController.uploadBook);
//Get books list
router.get("/books", commonController.getAllBooks);
//Get specific Book
router.get("/book/:id", commonController.getBook)
//Edit Books
router.put("/edit-book/:id", adminController.editBook);
//delete book
router.delete("/book/:id", commonController.deleteBook)



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


//notice
//get
router.get("/all-notice",adminController.getAllNotice )
//specific notice
router.get("/notice/:id", adminController.getNotice);

//post
router.post("/notice-post",adminController.uploadNotice)

//edit
router.put("/edit-notice/:id", adminController.editNotice);
//delete
router.delete("/notice/:id", adminController.deleteNotice)





module.exports = router;
