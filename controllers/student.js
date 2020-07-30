const User = require('../models/User');
const Class = require('../models/Class');
const Assignmnet = require('../models/Assignment');
const Submission = require('../models/Submission');
const Book = require('../models/Book');
const Parent = require('../models/Parents');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");

exports.changePasword=async(req,res)=>{
  let user
  try{
    user= await User.findById(req.user._id)
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

exports.logout = async(req, res) => {

  req.logout();
  res.status(200).json('logged Out')
}
exports.getUser=async (req, res)=>{
  

  const userDB =await User.findById(req.user._id).populate('section')
  const sectionDB = await userDB.section//edit the array into single unit. a student will have only one
  

  classesArray = []
  if(sectionDB){
    const arrayOfClass= sectionDB.classes
    for(const classId of arrayOfClass) {
      const classDB = await Class.findById(classId).populate('teacher');
      const teacher = classDB.teacher

      classesArray.push({name:  classDB.subject, teacher:teacher.name , url: `${process.env.URL}api/student/class/${classId}`} );
     }
     return res.status(200).json({
       user:{
        "name":req.user.name,
        "userid": req.user.userid,
        "email":req.user.email,
        "image": req.user.profileImage,
        "section":userDB.section.sectionName,
        "classes":classesArray,
       }
      
  
    })
  }else{
   
    res.status(201).json({
      user:{
        "name":req.user.name,
        "userid": req.user.userid,
        "email":req.user.email,
        "image": req.user.profileImage,
        "section":"No classes or section has been added",
        "classes":"No classes or section has been added",
        
         }})
  }
  
  
  
  
}
//get all class
exports.getAllClass =async(req,res,next)=>{
  const userDB =await User.findById(req.user._id).populate('section')
  const sectionDB = await userDB.section//edit the array into single unit. a student will have only one
  

  classesArray = []
  if(sectionDB){
    const arrayOfClass= sectionDB.classes
    for(const classId of arrayOfClass) {
      const classDB = await Class.findById(classId).populate('teacher');
      const teacher = classDB.teacher

      classesArray.push({name:  classDB.subject, id: classDB.id, teacher:teacher.name , url: `${process.env.URL}api/student/class/${classId}`} );
     }
     return res.status(200).json( 
      classesArray
    )
  }else{
   
    res.status(201).json("No classes or section has been added")
  }
  

}

exports.getClass= async(req, res, next)=>{
  const id = req.params.id;
  console.log(id)
  const classRoom = await Class.findById(id).populate('assignments')
  res.status(201).json(classRoom)

}

exports.getAssignments = async(req, res, next)=>{


  const userDB= await User.findById(req.user.id).populate('section')
  const sectionDB = await userDB.section
  if(sectionDB){
    const sectionDBS=  userDB.section.populate('classes')
    const arrayOfClass= sectionDBS.classes//change it to single from array, one student have once section
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

  }else{
    res.status(201).json("No assignments or task")
  }
  
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
    newSubmission.class= assignmentDB.class,
    console.log(assignmentDB.class)
    await newSubmission.save()
    assignmentDB.submission.push(newSubmission)
    const newAssFile = await assignmentDB.save()
    res.status(201).json(newAssFile)
  }catch(err){
    
    res.status(400).json({message: err.message})

  }

} 

exports.getPayment= async(req,res,next)=>{
  const payment = req.user.payment
  if(payment){
  try {
    res.status(200).json(payment)
  } catch (error) {
    res.status(500).json(error)
  }}
}
exports.getUnPaidPayment= async(req,res,next)=>{
  const payments = req.user.payment
  const paymentArray=[]
  if(payments){
    for(const payment of payments){
      if(payment.paid==false){
        paymentArray.push({description:payment.description, amount:payment.amount, pay: `${process.env.URL}api/student/pay/${payment.id}`})
      }
      
      
    }
  }else{
    res.status(200).json("No payment yet")
  }
  try {
    res.status(200).json(paymentArray)
  } catch (error) {
    res.status(500).json(error)
  }
}
exports.getPaidPayment= async(req,res,next)=>{
  const payments = req.user.payment
  const paymentArray=[]
  if(payments){
    for(const payment of payments){
      if(payment.paid==true){
        paymentArray.push({description:payment.description, amount:payment.amount, pay:{get: `${process.env.URL}api/student/pay/${payment.id}`}})
      }
      
      
    }
  }else{
    res.status(200).json("No payment yet")
  }
  try {
    res.status(200).json(paymentArray)
  } catch (error) {
    res.status(500).json(error)
  }
}
exports.getOnePayment= async(req,res,next)=>{
  const paymentDBS = req.user.payment
  const paymentDets=[]
  for(paymentDB of paymentDBS){
    if(paymentDB.id==req.params.id){
      paymentDets.push({paid: paymentDB.paid,description:paymentDB.description, amount:paymentDB.amount, pay: {post:`${process.env.URL}api/student/pay/${paymentDB.id}`}})
    }
  }

  try {
    res.status(200).json(paymentDets)
  } catch (error) {
    res.status(500).json(error)
    
  }
}

exports.payOnePayment= async(req,res,next)=>{
  const paymentDBS = req.user.payment
  const paymentDets=[]
  for(paymentDB of paymentDBS){
    if(paymentDB.id==req.params.id){
      paymentDB.paid=true
      await req.user.save()
    }
  }

  try {
    res.status(200).json(paymentDB)
  } catch (error) {
    res.status(500).json(error)
    
  }
}
