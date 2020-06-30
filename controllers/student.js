const User = require('../models/User');
const Class = require('../models/Class');
const Assignmnet = require('../models/Assignment');
const Submission = require('../models/Submission');
const Book = require('../models/Book');
const Parent = require('../models/Parents');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");


exports.getUser=async (req, res)=>{

  const userDB =await User.findById(req.user._id).populate('section')
  const sectionDB = await userDB.section[0]//edit the array into single unit. a student will have only one
  

  classesArray = []
  const arrayOfClass= sectionDB.classes
  for(const classId of arrayOfClass) {
    const classDB = await Class.findById(classId).populate('teacher');
    const teacher = classDB.teacher

    classesArray.push({name:  classDB.subject, teacher:teacher.name , url: `${process.env.URL}api/student/class/${classId}`} );
  }
  
  
  return res.status(200).json({
    "name":req.user.name,
    "userid": req.user.userid,
    "email":req.user.email,
    "image": req.user.profileImage,
    "section":userDB.section[0].sectionName,
    "classes":classesArray,

  })
}

exports.getClass= async(req, res, next)=>{
  const id = req.params.id;
  console.log(id)
  const classRoom = await Class.findById(id).populate('assignments')
  res.status(201).json(classRoom)

}

exports.getAssignments = async(req, res, next)=>{
  
  const userDB= await User.findById(req.user.id).populate('section')
  const sectionDB=  userDB.section[0].populate('classes')
  
  const arrayOfClass= sectionDB.classes//change it to single from array, one student have once section
  assignments=[]
  for(const classId of arrayOfClass) {
    const classDB = await Class.findById(classId);

    const assignmnetIDS= classDB.assignments
      
    assignmentDets=[]

    for(const assignmentID of assignmnetIDS) {
      const AssignmentDB = await Assignmnet.findById(assignmentID);

      assignmentDets.push({class:classDB.subject, 
                            name: AssignmentDB.title, 
                            details: AssignmentDB.details, 
                            file: AssignmentDB.assignmentFile, 
                            request:{
                              type: 'POST',
                              url:`${process.env.URL}assignment/${AssignmentDB._id}`
                            } });
    }
  }
  res.status(201).json(assignmentDets)
}

exports.submitAssignmnet = async(req, res)=>{
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let submitAssignment = req.files.submittedFile;
  const assignmentDB = await Assignmnet.findById(req.params.id)
  
  let uploadPath= `public/submission/${assignmentDB.title+req.user.name+req.user.userid}.jpg`;

  submitAssignment.mv(uploadPath,  function(err) {
    if (err)
      return res.status(500).send(err);
  });
  
  const newSubmission= new Submission({
    submittedFile: uploadPath
  })
  try{
    const assignmentDB = await Assignmnet.findById(req.params.id)
    newSubmission.assignment = assignmentDB
    newSubmission.title= assignmentDB.title
    newSubmission.student = req.user
    await newSubmission.save()
    assignmentDB.submission.push(newSubmission)
    const newAssFile = await assignmentDB.save()
    res.status(201).json(newAssFile)
  }catch(err){
    
    res.status(400).json({message: err.message})

  }

} 