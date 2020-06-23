
const User = require('../models/User');
const Book =require('../models/Book');
const Notice =require('../models/Notice');
const Teacher =require('../models/Teacher');
const Admin = require('../models/Admin');
const Parent =require('../models/Parents');
const bcrypt = require("bcryptjs");


//Student Registration
exports.registerStudent=(req, res) => {

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let profileImage = req.files.profileImage;

  let uploadPath= `public/profile/${req.body.userid}.jpg`;
  
  profileImage.mv( uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    console.log('File uploaded!');
  });

  const password =  bcrypt.hashSync(req.body.userid, 12);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    role: "student",
    userid:req.body.userid,
    password:password,
    profileImage: uploadPath,

  });
  user
    .save()
    .then(result => {
      res.send(user)
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
//Students create, view, update, delete

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
              url: "http://localhost:5000/api/admin/student/" + doc.id
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


exports.getUser= async(req, res, next)=>{
  const id = req.params.id;
  console.log(id)
  const user = await User.findById(id)
  res.status(201).json(user)

}

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

exports.editUser = async(req,res)=>{
  let user
  try{
    user= await User.findById(req.params.id)
    console.log(user)
    const elements=['name', 'email', 'password'].filter(element => req.body[element]);
    for (let element of elements)
            user[element] = req.body[element];
    await user.save()
    res.status(200).json({
      message:"updated user"
  })
  }catch(err) {
    console.log(err)
  }

};






//Add Students to parents
exports.addToParent = async(req, res, next)=>{

  //Parent
  const parentID =req.params.parentid;
  const parentDB= await Parent.findById(parentID)
  //student DB
  const studentID = req.params.userid;
  const studentDB= await User.findById(studentID)
  studentDB.parent.push(parentDB)
  parentDB.user.push(studentDB)

  await parentDB.save()
  await studentDB.save()
  res.status(201).json(parentDB)
  console.log(parentDB.user)

}

/* @TEACHER 
create read update delete
*/

//Teacher Registration
exports.registerTeacher=(req, res) => {

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let profileImage = req.files.profileImage;

  let uploadPath= `public/profile/${req.body.userid}.jpg`;
  
  profileImage.mv( uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    console.log('File uploaded!');
  });

  const password =  bcrypt.hashSync(req.body.userid, 12);

  const teacher = new Teacher({
    name: req.body.name,
    email: req.body.email,
    userid:req.body.userid,
    password:password,
    profileImage: uploadPath,

  });
  teacher
    .save()
    .then(result => {
      res.send(teacher)
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

//get all teacher
exports.getAllTeacher=(req, res, next) => {
  Teacher.find()
    .select("name email role userid profileImage")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        teacher: docs.map(doc => {
          return {
            name: doc.name,
            email: doc.email,
            userid: doc.userid,
            role: doc.role,
            profileImage: doc.profileImage, 
            request: {
              type: "GET",
              url: "http://localhost:5000/api/admin/teacher/" + doc.id
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

//get a teacher
exports.getTeacher= async(req, res, next)=>{
  const id = req.params.id;
  console.log(id)
  const teacher = await Teacher.findById(id)
  res.status(201).json(teacher)

}

//delete teacher

exports.deleteTeacher= (req, res, next) => {
  Teacher.deleteOne({_id: req.params.id}).then(
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

//update teacher
exports.editTeacher = async(req,res)=>{
  let teacher
  try{
    teacher= await Teacher.findById(req.params.id)
    console.log(teacher)
    const elements=['name', 'email', 'password'].filter(element => req.body[element]);
    for (let element of elements)
            teacher[element] = req.body[element];
    await teacher.save()
    res.status(200).json({
      message:"updated teacher"
  })
  }catch(err) {
    console.log(err)
  }

};



/* @Admin
create read update delete
*/

//Admin Registration
exports.registerAdmin=(req, res) => {

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let profileImage = req.files.profileImage;

  let uploadPath= `public/profile/${req.body.userid}.jpg`;
  
  profileImage.mv( uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    console.log('File uploaded!');
  });

  const password =  bcrypt.hashSync(req.body.userid, 12);

  const admin = new Admin({
    name: req.body.name,
    email: req.body.email,
    userid:req.body.userid,
    password:password,
    profileImage: uploadPath,

  });
  admin
    .save()
    .then(result => {
      res.send(admin)
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

//get all admin
exports.getAllAdmin=(req, res, next) => {
  Admin.find()
    .select("name email role userid profileImage")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        admin: docs.map(doc => {
          return {
            name: doc.name,
            email: doc.email,
            userid: doc.userid,
            role: doc.role,
            profileImage: doc.profileImage, 
            request: {
              type: "GET",
              url: "http://localhost:5000/api/admin/admin/" + doc.id
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

//get a teacher
exports.getAdmin= async(req, res, next)=>{
  const id = req.params.id;
  console.log(id)
  const admin = await Admin.findById(id)
  res.status(201).json(admin)

}

//delete admin

exports.deleteAdmin= (req, res, next) => {
  Admin.deleteOne({_id: req.params.id}).then(
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

//update Admin
exports.editAdmin = async(req,res)=>{
  let admin
  try{
    admin= await Admin.findById(req.params.id)
    console.log(admin)
    const elements=['name', 'email', 'password'].filter(element => req.body[element]);
    for (let element of elements)
            admin[element] = req.body[element];
    await admin.save()
    res.status(200).json({
      message:"updated Admin"
  })
  }catch(err) {
    console.log(err)
  }

};




//books create update delete

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

exports.deleteBook= (req, res, next) => {
  Book.deleteOne({_id: req.params.id}).then(
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

