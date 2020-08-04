const router = require('express-promise-router')();
// Bring in the User Registration function
const {
  parentAuth,
  parentLogin,
  checkRole,
  serializeUser
} = require("../utils/Auth");

const commonController =require("../controllers/commonController");
const parentController= require("../controllers/parent")

/*
// Profile Route
router.route("/profile")
  .get(userAuth,parentController.getProfile)  
*/
// parent Login Route
router.post("/login", async (req, res) => {
  await parentLogin(req.body, "parent", res);
});

router.route('/profile')
  .get(parentAuth, parentController.getProfile)

// parent change password Route
router.put("/change-password/:id", 
            parentAuth,
            checkRole(["parent"]), 
            commonController.changePasword);




//payment





/*

//Parents Protected Route
router.get(
  "/parent-protectd",
  userAuth,
  checkRole(["parent"]),
  async (req, res) => {
    return res.json("Hello parent");
  }
);
*/

module.exports = router;
