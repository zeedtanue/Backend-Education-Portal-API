
const User = require('../models/User');
const Book =require('../models/Book');





  exports.getAllUsers = async(req, res) => {
    User.find({}, function(err, users) {
      var userMap = {};
  
      users.forEach(function(user) {
        userMap[user._id] = user;
      });
  
      res.send(userMap);  
    });
  };


exports.deleteUser= (req, res, next) => {
  User.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
}

exports.uploadBook=async (req, res) => {

  const book = new Book({
      name: req.body.name,
      author: req.body.author,
      summery: req.body.summery,
      subject: req.body.subject,
      price: req.body.price,
      publishedAt:req.body.publishedAt,
    })
    try{
        const newBook= await book.save()
        console.log(req.body);
        res.status(201).json(newBook)
    }catch(err){
        res.status(400).json({message: err.message})
    }
     
          
}

exports.editBook= async(req,res)=>{
  let book
  try{
    book= await Book.findById(req.params.id)
    const elements=['name', 'author', 'summery', 'subject', 'price', 'publeshedAt'].filter(element => req.body[element]);
    for (let element of elements)
            book[element] = req.body[element];
    await book.save()
    res.status(200).json({
      message:"updated Book"
  })
  }catch(err) {
    console.log(err)
  }

};
