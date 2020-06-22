
const User = require('../models/User');
const Book =require('../models/Book');
const Notice =require('../models/Notice');




exports.getAllUser=(req, res, next) => {
  User.find()
    .select("name email role userid profileImage")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        user: docs.map(doc => {
          return {
            name: doc.name,
            email: doc.email,
            userid: doc.userid,
            role: doc.role,
            profileImage: doc.profileImage, 
            request: {
              type: "GET",
              url: "http://localhost:5000/api/admin/user/" + doc.id
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



exports.getUser= (req, res, next) => {
  const id = req.params.id;
  console.log(id)
  User.findById(id)
    .select('name userid email _id profileImage')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            user: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:5000/user'
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

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let coverImage = req.files.coverImage;
  
  let uploadPathcoverImage= `public/book/coverImage/${req.body.name+req.body.author}.jpg`;

  coverImage.mv(uploadPathcoverImage,  function(err) {
    if (err)
      return res.status(500).send(err);
  
    res.send('File uploaded!');
  });
  let BookFile = req.files.bookFile;

  let uploadPathBookFile = `public/book/bookPDF/${req.body.subject+req.body.name+req.body.author}.pdf`;

  BookFile.mv(uploadPathBookFile,  function(err) {
    if (err)
      return res.status(500).send(err);
  
    res.send('File uploaded!');
  });

  const book = new Book({
      name: req.body.name,
      author: req.body.author,
      summery: req.body.summery,
      subject: req.body.subject,
      price: req.body.price,
      publishedAt:req.body.publishedAt,
      coverImage: process.env.URL+uploadPathcoverImage,
      bookFile: process.env.URL+uploadPathBookFile,

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
    const elements=['name', 'author', 'summery', 'subject', 'price', 'publeshedAt', 'coverImage', 'bookFile'].filter(element => req.body[element]);
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

//Notice
exports.uploadNotice=async (req, res) => {

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let cover = req.files.cover;
  
  let uploadPathcover= `public/notice/${req.body.name+req.body.id}.jpg`;

  cover.mv(uploadPathcover,  function(err) {
    if (err)
      return res.status(500).send(err);
  
    res.send('File uploaded!');
  });
  
  const notice = new Notice({
      name: req.body.name,
      publishedAt: req.body.publishedAt,
      cover: process.env.URL+uploadPathcover,

    })
    try{
        const newNotice= await notice.save()
        console.log(req.body);
        res.status(201).json(newNotice)
    }catch(err){
        res.status(400).json({message: err.message})
    }
}

exports.getAllNotice=(req, res, next) => {
  Notice.find()
    .select("name createdAt cover")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        notice: docs.map(doc => {
          return {
            name: doc.name,
            publishedAt: doc.publishedAt,
            cover: doc.cover, 
            request: {
              type: "GET",
              url: "http://localhost:5000/api/admin/notice/" + doc.id
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



exports.getNotice= (req, res, next) => {
  const id = req.params.id;
  console.log(id)
  Notice.findById(id)
    .select('name createdAt cover')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            notice: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:5000/api/admin/all-notice'
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


exports.deleteNotice= (req, res, next) => {
  Notice.deleteOne({_id: req.params.id}).then(
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

exports.editNotice= async(req,res)=>{
  let notice
  try{
    notice= await Notice.findById(req.params.id)
    const elements=['name' ,'cover'].filter(element => req.body[element]);
    for (let element of elements)
            notice[element] = req.body[element];
    await notice.save()
    res.status(200).json({
      message:"updated notice"
  })
  }catch(err) {
    console.log(err)
  }

};

