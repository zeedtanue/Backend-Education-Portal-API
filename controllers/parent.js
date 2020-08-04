const Parent = require('../models/Parents')
const Student =require('../models/User')

exports.getProfile= async (req,res,next)=>{
    const parentDB= req.user
    const userIDs= parentDB.user
    const userDets=[]
    for(userID of userIDs){
        const StudentDB= await Student.findById(userID)
        userDets.push({name: StudentDB.name,id:StudentDB._id, payment:StudentDB.payment})
    }
    res.status(200).json({name: parentDB.name, email:parentDB.email, students:userDets})
}

