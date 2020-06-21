const User = require('../models/User');
const Book = require('../models/Book');
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

exports.registerStudent=(req, res) => {
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

  const product = new User({
    name: req.body.name,
    email: req.body.email,
    role: "student",
    userid:req.body.userid,
    password:password,
    profileImage: uploadPath
  });
  product
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

exports.registerParent=(req, res) => {
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

  const product = new User({
    name: req.body.name,
    email: req.body.email,
    role: "parent",
    userid:req.body.userid,
    password:password,
    profileImage: uploadPath
  });
  product
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

  const product = new User({
    name: req.body.name,
    email: req.body.email,
    role: "teacher",
    userid:req.body.userid,
    password:password,
    profileImage: uploadPath
  });
  product
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

exports.registerUser=(req, res) => {
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

  const product = new User({
    name: req.body.name,
    email: req.body.email,
    role: "admin",
    userid:req.body.userid,
    password:password,
    profileImage: uploadPath
  });
  product
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

  exports.getAllBooks = async(req, res) => {
    Book.find({}, function(err, books) {
      var bookMap = {};
  
      books.forEach(function(book) {
        bookMap[book._id] = book;
      });
  
      res.send(bookMap);  
    });
  };