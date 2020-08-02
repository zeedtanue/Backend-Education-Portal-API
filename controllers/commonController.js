const User = require('../models/User');
const Book = require('../models/Book');
const Parent = require('../models/Parents');
const bcrypt = require("bcryptjs");
const Teacher = require('../models/Teacher');
const Class =require('../models/Class');
const Assignment = require('../models/Assignment');
const Resource = require('../models/Resource');
const Submission = require('../models/Submission');
exports.changePasword=async(req,res)=>{
    let user
    try{
      user= await Teacher.findById(req.user._id)
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


//teacher get profile
exports.getUserTeacher=async (req, res)=>{
  

  const userDB =await Teacher.findById(req.user._id)
  


    
     return res.status(200).json({
       user:{
        "name":req.user.name,
        "userid": req.user.userid,
        "email":req.user.email,
        "image": req.user.profileImage,
        "totalClasses":userDB.classes.length
       }
      
  
    })};


  
  exports.getAllClass= async (req, res, next) => {
    let teacherClasses
    try{
      teacherClasses= await Teacher.findById(req.user._id).populate('classes')
      
      /*const classIDS= teacherClasses.classes
      const classes = [];

      for(const classID of classIDS) {
        const classDB = await Class.findById(classID);
        console.log(classDB)
        classes.push({ name: classDB.subject, url: 'http://46.101.188.213:5000/api/teacher/class/'+classID });
      } */

      return res.json(teacherClasses.classes);
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

//post task under class
exports.postTask=  async (req, res) => {

  let asFile = req.files.assignmentFile;
  
  let assignmentPath= `public/assignments/fromTeacher/${req.body.title+req.user.id}.pdf`;

  asFile.mv(assignmentPath,  function(err) {
    if (err)
      return res.status(500).send(err);
  
  });
  
  const assignment = new Assignment({
      title: req.body.title,
      details:req.body.details,
      mark: req.body.mark,
      dueDate: req.body.dueDate,
      assignmentFile: process.env.URL+assignmentPath,

    })
    try{
        
        const classDB = await Class.findById(req.params.id)//finding class by params id
        assignment.class= classDB//class of the assignment
        assignment.teacher = req.user//find it using passport
        classDB.assignments.push(assignment)//pushing assignment to class

        const newAssignment = await assignment.save()
        await classDB.save()
        res.status(201).json(newAssignment)
        console.log(`${newAssignment.title} is uploaded by ${req.user.name}`)
        
        
    }catch(err){
      console.log(err)
        res.status(400).json({message: err.message})
    }
}

//get the previous task.
exports.getAllTask= async (req, res, next) => {
  let classesAssignment
  try{
    classesAssignment= await Class.findById(req.params.id)
    const assignmentIDS= classesAssignment.assignments
    const runningAssignment = [];

    for(const assignmentID of assignmentIDS) {
      const assignmentDB = await Assignment.findById(assignmentID);
      console.log(assignmentDB)
      runningAssignment.push({ name: assignmentDB.title, url: 'http://46.101.188.213:5000/api/teacher/class/get-task/'+assignmentID });
    }

    return res.json(runningAssignment);
  }catch(err){
    console.log(err)
  }
};

//get specific task
exports.getTask = async (req, res)=>{
  const task = await Assignment.findById(req.params.id).populate('submission')
  task.populate('student')
  try{
    res.status(200).json({"task":task, "student":task.student})
  }catch(err){
    res.json(500).json(err)
  }
}

//resouces and notes
exports.postResource=  async (req, res) => {

  let resourceFile = req.files.resourceFile;
  
  
  let resourcePath= `public/resource/${req.body.title+req.user.id}.pdf`;

  resourceFile.mv(resourcePath,  function(err) {
    if (err)
      return res.status(500).send(err);
      

  });
  
  const resource = new Resource({
      title: req.body.title,
      details:req.body.details,
      resourceFile: process.env.URL+resourcePath,

    })
    console.log(resource)
    
    try{
        
        const classDB = await Class.findById(req.params.id)//finding class by params id
        resource.class= classDB//class of the assignment

        //resource.teacher = classDB.teacher[0]
        classDB.resource.push(resource)
        console.log(`Resource:${classDB.resource.length}`)
        await classDB.save()
        const newRes = await resource.save()
        res.status(201).json(newRes)
          console.log(`${newRes.title} is uploaded at ${classDB.subject}`)
        
        
    }catch(err){
        res.status(400).json({message: err.message})
    }
}

//get all resources 
exports.getAllResources= async (req, res, next) => {
  let classesResource
  try{
    classesResource= await Class.findById(req.params.id)
    const resourceIDS= classesResource.resource
    const resource = [];

    for(const resourceID of resourceIDS) {
      const resourceDB = await Resource.findById(resourceID);
      console.log(resourceDB)
      resource.push({ name: resourceDB.title, url: 'http://46.101.188.213:5000/api/teacher/class/resource/'+assignmentID, file: resourceDB.resourceFile });
    }

    return res.json(resource);
  }catch(err){
    console.log(err)
  }
};



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
              id:doc.id,
              name: doc.name,
              author: doc.author,
              subject: doc.subject,
              price: doc.price,
              summery: doc.summery,
              coverImage: doc.coverImage,
              bookFile: doc.bookFile, 
              request: {
                type: "GET",
                url: "http://46.101.188.213:5000/api/admin/book/" + doc.id
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
              book: doc,
              request: {
                  type: 'GET',
                  url: 'http://46.101.188.213:5000/api/admin/books'
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
  
  
  //submission of specific task
  exports.getAllSubmission= async (req, res)=>{
    const assignmentDB = await Assignment.findById(req.params.id).populate('submission')
    const submissionIDS = assignmentDB.submission
    arrayOfRes=[]
    for(submissionID of submissionIDS){
      const name =await User.findById(submissionID.student)
      console.log(name.name)
      arrayOfRes.push({ name: name.name,
                        title: submissionID.title,
                        submittedFile: submissionID.submittedFile,
                        submittedDate: submissionID.submittedDate
                        })
    }
    try{
      res.status(201).json(arrayOfRes)
    }catch(err){
      console.log(err)

    }
    
  }


  //get all the student under class
  exports.getAllStudent= async (req, res, next) => {
    let classStudent
    try{
      classStudent= await Class.findById(req.params.id).populate('section')
      const section= classStudent.section
      const studentIDS= section.student
      console.log(studentIDS)

      const studentArray=[]
      for (const studentID of studentIDS){
        const studentDB = await User.findById(studentID)
        studentArray.push({id: studentDB._id,name: studentDB.name,profileImage:process.env.URL +studentDB.profileImage, userID:studentDB.userid, assignments: `${process.env.URL}api/teacher/student/assignment-mark/${req.params.id}/${studentDB.id}` })
        res
          .status(200)
          .json(
            studentArray
          )
      }
      }catch(err){
      console.log(err)
    }
  };
  exports.getSubmissionHistory= async(req, res, next)=>{
    const classDB = await Class.findById(req.params.classid).populate('assignments')
    const studentDB = await User.findById(req.params.studentid)
    const assignments= classDB.assignments
    const resArray= []
    for (const assignment of assignments){
      const submissions= assignment.submission
      
      for (const submission of submissions){
        const submissionDB = await Submission.findById(submission)
      
        if(submissionDB.student==req.params.studentid){
          resArray.push({submissionDB})
        }else{
          resArray.push("no file were uploaded")
        }
        
      }
      
    }
    try{
      res
        .status(200)
        .json(resArray)

    }catch(err){
      res
        .status(500)
        .json(err)
    }
  }