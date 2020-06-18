const router = require("express").Router();
// Bring in the User Registration function
const {
  userAuth,
  userLogin,
  checkRole,
  userRegister,
  changePassword,
  serializeUser
} = require("../utils/Auth");

const commonController = require("../controllers/commonController")

router.get("/", function(req, res, next) {
  res.render('index', { title: 'Admin' });
})
// Users Registeration Route

// student Login Route
router.post("/login", async (req, res) => {
  await userLogin(req.body, "student", res);
});

// student change password Route
router.put("/change-password/:id", 
            userAuth,
            checkRole(["student"]), 
            commonController.changePasword);

// Profile Route
router.get("/profile", userAuth, async (req, res) => {
  return res.json(serializeUser(req.user));
});

// student Protected Route
router.get(
  "/student-protectd",
  userAuth,
  checkRole(["student"]),
  async (req, res) => {
    return res.json("Hello User");
  }
);


module.exports = router;
