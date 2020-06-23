const User = require('../models/User');
const Book = require('../models/Book');
const Parent = require('../models/Parents');
const bcrypt = require("bcryptjs");

exports.changePasword=async(req,res)=>{
    let user
    try{
      user= await User.findById(req.params.id)
      const password = await bcrypt.hash(req.body.password, 12);
      user.password = password
      await user.save()
      res.status(200).json({
          message:"updated Password"
      })
    }catch(err) {
      console.log(err)
    }
  
  };



exports.registerParent=(req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let profileImage = req.files.profileImage;

  let uploadPath= `public/profile/${req.body.name+req.body.email}.jpg`;
  
  profileImage.mv( uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });

  const password =  bcrypt.hashSync(req.body.email, 12);

  const parent = new Parent({
    name: req.body.name,
    email: req.body.email,
    userid:req.body.userid,
    password:password,
    profileImage: uploadPath
  });
  parent
    .save()
    .then(result => {
      //console.log(result);
      res.status(201).json({
        message: "Created Profile successfully",
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  }
exports.registerTeacher=(req, res) => {
  
  let userIDTaken = User.findOne({userid: req.body.userid}); //here i am searching for userID in collection
  console.log(req.body.userid)
  if (userIDTaken) {
    console.log(userIDTaken) //my condition about if userID exists in collection
    return res.status(400).json({
      
      message: `userID is already taken.`, //showing the message
      success: false
    });
  }
  
  let emailTaken = User.findOne(req.body.email); //same condition for email
  if (emailTaken) {
    return res.status(400).json({
      message: `email is already taken.`,
      success: false
    });
  }

if (!req.files || Object.keys(req.files).length === 0) {
  return res.status(400).send('No files were uploaded.');
}
let profileImage = req.files.profileImage;

let uploadPath= `public/profile/${req.body.userid}.jpg`;

profileImage.mv( uploadPath, function(err) {
  if (err)
    return res.status(500).send(err);

  res.send('File uploaded!');
});

const password =  bcrypt.hashSync(req.body.userid, 12);

const user = new User({
  name: req.body.name,
  email: req.body.email,
  role: "teacher",
  userid:req.body.userid,
  password:password,
  profileImage: uploadPath
});
user
  .save()
  .then(result => {
    //console.log(result);
    res.status(201).json({
      message: "Created Profile successfully",
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
}

exports.registerAdmin=(req, res) => {
  
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let profileImage = req.files.profileImage;

  let uploadPath= `public/profile/${req.body.userid}.jpg`;
  
  profileImage.mv( uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });

  const password =  bcrypt.hashSync(req.body.userid, 12);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    role: "admin",
    userid:req.body.userid,
    password:password,
    profileImage: process.env.URL+uploadPath
  });
  user
    .save()
    .then(result => {
      //console.log(result);
      res.status(201).json({
        message: "Created Profile successfully",
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  }


  //books get
  exports.getAllBooks = (req, res, next) => {
    Book.find()
      .select("name subject author summery price publishedAt coverImage bookFile")
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
          book: docs.map(doc => {
            return {
              name: doc.name,
              author: doc.author,
              subject: doc.subject,
              price: doc.price,
              summery: doc.summery,
              coverImage: doc.coverImage,
              bookFile: doc.bookFile, 
              request: {
                type: "GET",
                url: "http://localhost:5000/api/admin/book/" + doc.id
              }
            };
          })
        };
        
        res.status(200).json(response);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };  

  exports.getBook= (req, res, next) => {
    const id = req.params.id;
    console.log(id)
    Book.findById(id)
      .select('name subject author summery price publishedAt coverImage bookFile')
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
              user: doc,
              request: {
                  type: 'GET',
                  url: 'http://localhost:5000/api/admin/books'
              }
          });
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  };
  
  
  
  