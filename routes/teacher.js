const router = require("express").Router();
// Bring in the User Registration function
const {
  userAuth,
  userLogin,
  checkRole,
  userRegister,
  serializeUser
} = require("../utils/Auth");


const commonController =require("../controllers/commonController");

router.get("/", function(req, res, next) {
  res.render('index', { title: 'Teacher' });
})
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

// teacher Protected Route
router.get(
  "/teacher-protectd",
  userAuth,
  checkRole(["teacher"]),
  async (req, res) => {
    return res.json("Hello Teacher");
  }
);


module.exports = router;
