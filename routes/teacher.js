const router = require('express-promise-router')();
// Bring in the User Registration function
const {
  userAuth,
  teacherLogin,
  checkRole,
  serializeUser
} = require("../utils/Auth");


const commonController =require("../controllers/commonController");


router.route('/login')
  .post(async (req, res) => {
    await teacherLogin(req.body, "teacher", res);
  })
router.route('/class/:id')
  .get(commonController.getAllClass);


router.route('/get-class/:id')
  .get(commonController.getClass);
  
  



/*
// teacher Login Route
router.post("/login-teacher", async (req, res) => {
  await userLogin(req.body, "teacher", res);
});

// teacher change password Route
router.put("/change-password/:id", 
            userAuth,
            checkRole(["teacher"]), 
            commonController.changePasword);



// Profile Route
router.get("/profile", userAuth, async (req, res) => {
  return res.json(serializeUser(req.user));
});

//Books
//Book List
router.get("/books",userAuth, checkRole(["teacher"]), commonController.getAllBooks);


// teacher Protected Route
router.get(
  "/teacher-protectd",
  userAuth,
  checkRole(["teacher"]),
  async (req, res) => {
    return res.json("Hello Teacher");
  }
);
*/

module.exports = router;
