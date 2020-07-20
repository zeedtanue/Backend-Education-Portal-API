const { Schema, model } = require("mongoose");

const AssignmentSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    details:{
        type:String,
        required:true
    },
    mark:{
      type:Number,
      required:true
    },
    dueDate:{
      type:Date
    },
    submission:[{
      type:Schema.Types.ObjectId,
      ref:'submission'
    }],
    teacher:{
      type:Schema.Types.ObjectId,
      ref: 'teacher'
    },
    class:{
      type:Schema.Types.ObjectId,
      ref: 'class'
    },
    assignmentFile:{
        type:String,
        required:false
    }
    

  },
  { timestamps: true }
);

module.exports = model("assignment", AssignmentSchema);
