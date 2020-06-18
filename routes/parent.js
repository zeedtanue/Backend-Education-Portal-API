const router = require("express").Router();
// Bring in the User Registration function
const {
  userAuth,
  userLogin,
  checkRole,
  serializeUser
} = require("../utils/Auth");

const commonController =require("../controllers/commonController");


router.get("/", function(req, res, next) {
  res.render('index', { title: 'Admin' });
})

// Profile Route
router.get("/profile", userAuth, async (req, res) => {
    return res.json(serializeUser(req.user));
  });

// parent Login Route
router.post("/login-parent", async (req, res) => {
  await userLogin(req.body, "parent", res);
});

// parent change password Route
router.put("/change-password/:id", 
            userAuth,
            checkRole(["parent"]), 
            commonController.changePasword);


//Parents Protected Route
router.get(
  "/parent-protectd",
  userAuth,
  checkRole(["parent"]),
  async (req, res) => {
    return res.json("Hello parent");
  }
);


module.exports = router;
