const router = require('express-promise-router')();
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
const studentController = require("../controllers/student")


router.route('/login')
  .post(async (req, res) => {
    await userLogin(req.body, "student", res);
  })
router.route('/profile')
  .get(userAuth, studentController.getUser)

router.route('/class/:id')
  .get(userAuth, studentController.getClass)

router.route('/class')
  .get(userAuth, studentController.getAllClass)

//all assignment
router.route('/assignments')
  .get(userAuth, studentController.getAssignments)

//missing assignmnet
//submit assignment
router.route('/assignments/:id')
  .post(userAuth, studentController.submitAssignmnet)
//upcomming submission



//payment
router.route('/payment')
  .get(userAuth, studentController.getPayment)

router.route('/payment-unpaid')
  .get(userAuth, studentController.getUnPaidPayment)

//payment bill details
router.route('/pay/:id')
  .get(userAuth,studentController.getOnePayment)
  .post(userAuth, studentController.payOnePayment)
  
router.route('/payment-paid')
.get(userAuth, studentController.getPaidPayment)
/*
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

*/
module.exports = router;
