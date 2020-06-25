const User = require('../models/User');
const Book = require('../models/Book');
const Parent = require('../models/Parents');
const bcrypt = require("bcryptjs");
const Teacher = require('../models/Teacher');
const Class =require('../models/Class');
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

  //tacher all class



  
  exports.getAllClass= async (req, res, next) => {
    let teacherClasses
    try{
      teacherClasses= await Teacher.findById(req.params.id)
      const classIDS= teacherClasses.classes
      const classes = [];

      for(const classID of classIDS) {
        const classDB = await Class.findById(classID);
        console.log(classDB)
        classes.push({ name: classDB.subject, url: 'http://localhost:5000/api/teacher/class'+classID });
      }

      return res.json(classes);
      
      

        


      
    }catch(err){
      console.log(err)
    }
  };

    exports.getClass= async(req, res, next)=>{
      const id = req.params.id;
      console.log(id)
      const classRoom = await Class.findById(id)
      res.status(201).json(classRoom)
    
    }


//get users under parents
exports.getStudentUnderParents= async(req,res,next)=>{
  const student = await Parent.findById(req.params.parentID).populate('user');
  console.log(student)
  res.status(200).json(student.user);
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
  
  
  
  