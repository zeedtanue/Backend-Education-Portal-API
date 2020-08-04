const Parent = require('../models/Parents')
const Student =require('../models/User')

exports.getProfile= async (req,res,next)=>{
    const parentDB=  await Parent.findById(req.user._id).populate('user')
    
    res.status(200).json({parentDB})
}

