const router = require('express-promise-router')();

const {
  userAuth,
  adminLogin,
  checkRole,
  userRegister,
  serializeUser
} = require("../utils/Auth");
const adminController =require("../controllers/admin")

const commonController =require("../controllers/commonController");

router.route('/login')
  .post(async (req, res) => {
    await adminLogin(req.body, "admin", res);
  })
router.route('/register-admin')
  .post(adminController.registerAdmin)

router.route('/student')
  .post(adminController.registerStudent)
  .get(adminController.getAllUser);

router.route('/student/:userid')
  .get(adminController.getUser)
  .delete(adminController.deleteUser)
  .put(adminController.editUser);


//add students to parents
router.route('/student-in-parent/:parentid/:userid')
  .post(adminController.addToParent)
  .put(adminController.editUser)
  .delete(adminController.deleteUser);

  
router.route('/parent')
  .get(adminController.getAllParent)
  .post(adminController.registerParent);
router.route('/parent/:id')
  .get(adminController.getParent)
  .delete(adminController.deleteParent)
  .put(adminController.editParent);


router.route('/parent/students/:parentID')
  .get(commonController.getStudentUnderParents);



router.route('/teacher')
  .post(adminController.registerTeacher)
  .get(adminController.getAllTeacher);

router.route('/teacher/:id')
  .get(adminController.getTeacher)
  .delete(adminController.deleteTeacher)
  .put(adminController.editTeacher);

router.route('/admin')
  .post(adminController.registerAdmin)
  .get(adminController.getAllAdmin);


router.route('/notice')
  .post(adminController.uploadNotice)
  .get(adminController.getAllNotice);

router.route('/notice/:id')
  .get(adminController.getNotice)
  .delete(adminController.deleteNotice)
  .put(adminController.editNotice);


router.route('/book')
  .post(adminController.uploadBook)
  .get(commonController.getAllBooks);

router.route('/book/:id')
  .get(commonController.getBook)
  .delete(adminController.deleteBook)
  .put(adminController.editBook);


//create section
router.route('/section')
  .get(adminController.getAllSection)
  .post(adminController.createSection);

router.route('/section/:id')
  .get(adminController.getSectionClass)



//add students to section
router.route('/student-in-section/:sectionID/:studentID')
  .post(adminController.addToSectionStudent);

router.route('/class/get-task/:id')
  .get(commonController.getTask)

router.route('/class')
  .get(adminController.getAllClass)
  .post(adminController.createClass);


router.route("/class/:id")
  .get(adminController.getClass)

  //add class to section
router.route('/class-to-section/:sectionID/:classID')
  .post(adminController.addClassToSection)


//ass teacher to class
router.route('/teacher-to-class/:classID/:teacherID')
  .post(adminController.addTeacherToClass)


//Students payment


router.route('/student/payment/:id')
  .post(adminController.payment)//post payment
  .get(adminController.getPayment)//get payment
  

router.route('/student/payment/:id/:amount')
  .post(adminController.ConfirmPayment)//confirmation

//status hold


/*
router.get("/", function(req, res, next) {
  res.render('index', { title: 'Admin' });
})

//post requests
// student Registeration Route
router.post("/student", adminController.registerStudent);
//add student to parent
router.post("/add-to-parent/:parentid/:userid", adminController.addToParent);


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
router.post("/notice-post",adminController.uploadNotice);
//edit
router.put("/edit-notice/:id", adminController.editNotice);
//delete
router.delete("/notice/:id", adminController.deleteNotice)



*/

module.exports = router;
