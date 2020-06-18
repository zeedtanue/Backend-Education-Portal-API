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

  exports.getAllBooks = async(req, res) => {
    Book.find({}, function(err, books) {
      var bookMap = {};
  
      books.forEach(function(book) {
        bookMap[book._id] = book;
      });
  
      res.send(bookMap);  
    });
  };