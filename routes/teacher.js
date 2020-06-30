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

router.route('/example')
  .get(userAuth, async(req,res)=>{
    console.log(req.user.name)
  }) 

router.route('/class')
  .get(userAuth, commonController.getAllClass);


router.route('/class/:id')
  .get(commonController.getClass);
  
//edit them with auto generated id req.user.id
router.route('/class/task/:id')
  .post(userAuth, commonController.postTask)
  .get(commonController.getAllTask);
  
router.route('/class/resource/:id')
  .post(userAuth, commonController.postResource)
  .get(commonController.getAllResources);


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
