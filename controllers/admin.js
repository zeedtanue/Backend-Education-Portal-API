
const User = require('../models/User');
const Book =require('../models/Book');
const Notice =require('../models/Notice');
const Teacher =require('../models/Teacher');
const Admin = require('../models/Admin');
const Class =require('../models/Class');
const Parent =require('../models/Parents');
const Section = require('../models/Scetion');
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
  })

  const password =  bcrypt.hashSync(req.body.userid, 12);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    role: "student",
    userid:req.body.userid,
    password:password,
    profileImage: process.env.URL+uploadPath,

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
            id:doc.id,
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
  const id = req.params.userid;
  console.log(id)
  const user = await User.findById(id).populate('section')
  res.status(201).json(user)

}

exports.deleteUser= (req, res, next) => {
  User.deleteOne({_id: req.params.userid}).then(
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
    user= await User.findById(req.params.userid)
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
  console.log(`${studentDB.name} student have been saved under ${parentDB.name}` )

}

/* @Parents
create read update delete
*/

//Parent Registration
exports.registerParent=(req, res) => {

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

  const parent = new Parent({
    name: req.body.name,
    email: req.body.email,
    userid:req.body.userid,
    password:password,
    profileImage:process.env.URL+ uploadPath,

  });
  parent
    .save()
    .then(result => {
      res.send(parent)
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

//get all parent
exports.getAllParent=(req, res, next) => {
  Parent.find()
    .select("name email role userid profileImage")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        parent: docs.map(doc => {
          return {
            id:doc.id,
            name: doc.name,
            email: doc.email,
            userid: doc.userid,
            role: doc.role,
            profileImage: doc.profileImage, 
            request: {
              type: "GET",
              url: "http://localhost:5000/api/admin/parent/" + doc.id
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

//get a parent
exports.getParent= async(req, res, next)=>{
  const id = req.params.id;
  console.log(id)
  const parent = await Parent.findById(id)
  res.status(201).json(parent)

}

//delete parent

exports.deleteParent= (req, res, next) => {
  Parent.deleteOne({_id: req.params.id}).then(
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

//update parent
exports.editParent = async(req,res)=>{
  let parent
  try{
    parent= await Parent.findById(req.params.id)
    console.log(parent)
    const elements=['name', 'email', 'password'].filter(element => req.body[element]);
    for (let element of elements)
          parent[element] = req.body[element];
    await parent.save()
    res.status(200).json({
      message:"updated parent"
  })
  }catch(err) {
    console.log(err)
  }

};



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
    profileImage: process.env.URL+uploadPath,

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
            id:doc.id,
            name: doc.name,
            email: doc.email,
            userid: doc.userid,
            role: doc.role,
            profileImage: doc.profileImage, 
            request: {
              type: "GET",
              url: `${process.env.URL}api/admin/teacher/` + doc.id
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
            id:doc.id,
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


//section

exports.createSection= async (req, res) => { 
  const section = new Section({
      sectionName: req.body.sectionName,
    })
    try{
        const newSection= await section.save()
        console.log(req.body);
        res.status(201).json(newSection)
    }catch(err){
        res.status(400).json({message: err.message})
    }
}

exports.getSection= async(req, res, next)=>{
  const id = req.params.id;
  console.log(id)
  const section = await Section.findById(id)
  res.status(201).json(section)

}



exports.getAllSection= (req, res, next) => {
  const section = Section.find().populate('student');
  section.populate('classes')
  console.log(section.student)
  console.log(section.classes)
  section
    .select("sectionName student")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        section: docs.map(doc => {
          return {
            id:doc.id,
            name: doc.sectionName,
            classes_count:doc.classes.length,
            classes:doc.classes,
            student_count:doc.student.length,
            students:doc.student, 
            request: {
              type: "GET",
              url: "http://localhost:5000/api/admin/section/" + doc.id
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

//Add Students to parents
exports.addToSectionStudent = async(req, res, next)=>{


  const sectionDB= await Section.findById(req.params.sectionID)
  console.log(sectionDB)
  
  //student DB
  const studentDB= await User.findById(req.params.studentID)
  console.log(studentDB)
  
  studentDB.section = sectionDB
  sectionDB.student.push(studentDB)

  await sectionDB.save()
  await studentDB.save()
  res.status(201).json(sectionDB)
  console.log(`${studentDB.name} student have been saved under ${sectionDB.name}` )

}


//class
exports.getAllClass= (req, res, next) => {
  const className = Class.find().populate('teacher');
  className.populate('section')
    .select("subject section teacher resource assignment")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        className: docs.map(doc => {
          return {
            id:doc.id,
            subject: doc.subject,
            section:doc.section,
            teacher:doc.teacher,
            assignment:doc.assignment,
            resource:doc.resource, 
            request: {
              type: "GET",
              url: "http://localhost:5000/api/admin/class/" + doc.id
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
exports.getClass=(req, res, next) => {
  const id = req.params.id;
  console.log(id)
  Class.findById(id).populate('teacher')
    .select('subject teacher')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            class: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:5000/api/admin/class'
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


exports.createClass= async (req, res) => { 
  const classDB = new Class({
      subject: req.body.subject,
    })
    try{
        const newClass= await classDB.save()
        console.log(req.body);
        res.status(201).json(newClass)
    }catch(err){
        res.status(400).json({message: err.message})
    }
}

//add class to section
exports.addClassToSection = async(req, res, next)=>{


  const sectionDB= await Section.findById(req.params.sectionID)
  const classDB= await Class.findById(req.params.classID)
  

  classDB.section = sectionDB
  sectionDB.classes.push(classDB)

  await classDB.save()
  await sectionDB.save()
  res.status(201).json(sectionDB)
  console.log(`${classDB.subject} class has been assinged to ${sectionDB.sectionName}` )

}


exports.getSectionClass= (req, res, next) => {
  const id = req.params.id;
  console.log(id)
  const section = Section.findById(id).populate('classes')
  section.populate('student')
  
  
  section
    .select('sectionName classes student')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        classes = doc.classes.subject
        res.status(200).json({
            section: doc.sectionName,
            
            class: doc.classes,
            studentName:{name: doc.student.name},
            student:doc.student,
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

exports.addTeacherToClass= async(req, res, next)=>{

  const classDB= await Class.findById(req.params.classID)
  const teacherDB= await Teacher.findById(req.params.teacherID)

  classDB.teacher= teacherDB
  teacherDB.classes.push(classDB)

  await classDB.save()
  await teacherDB.save()
  res.status(201).json(teacherDB)
  console.log(`${classDB.teacher} has been assinged to ${teacherDB.classes}` )

}

exports.payment = async(req, res, next)=>{
  const student = await User.findById(req.params.id)
  const payment= student.payment
  payment.push({description: req.body.description,amount: req.body.amount, paid:false })
  await student.save()
  try {
    res 
      .status(200)
      .json(payment)
  } catch (error) {
      res
        .status(500)
        .json(error)
  }
}

exports.getPayment= async(req, res, next)=>{
  const student = await User.findById(req.params.id)
  try {
    res
      .status(200)
      .json({name: student.name, userid:student.userid, parents:student.parent, paymentHistory: student.payment})
  } catch (error) {
      res
        .status(500)
        .json(error)
  }
}


exports.ConfirmPayment= async(req,res)=>{
  let payment
  try{
    
    user = await User.findById(req.params.id)
    const paymentDB = user.payment.filter( (payment)=> {
      return payment.amount === req.params.amount;
    }).pop();
    paymentDB.paid=true;
    await user.save()
    console.log(paymentDB)
    res.status(200).json(paymentDB)
  }catch(err) {
    res.status(500).json(err)
  }

};
