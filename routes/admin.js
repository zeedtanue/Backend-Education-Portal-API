const router = require("express").Router();
// Bring in the User Registration function
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
router.post("/register-student", async (req, res) => {
  await userRegister(req.body, "student", res);
});

// teacher Registration Route
router.post("/register-teacher", async (req, res) => {
  await userRegister(req.body, "teacher", res);
});

// PARENTS Route
router.post("/register-parent", async (req, res) => {
  await userRegister(req.body, "parent", res);
});

// Admin Registration Route
router.post("/register-admin", async (req, res) => {
  await userRegister(req.body, "admin", res);
});


// Admin Login Route
router.post("/login-admin", async (req, res) => {
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
