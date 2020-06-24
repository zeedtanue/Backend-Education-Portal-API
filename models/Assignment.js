const { Schema, model } = require("mongoose");

const AssignmentSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    details:{
        type:string,
        required:true
    },
    teacher:[{
      type:Schema.Types.ObjectId,
      ref: 'teacher'
    }],
    class:[{
      type:Schema.Types.ObjectId,
      ref: 'class'
    }],
    assignmentFile:{
        type:string,
        required:false
    }
    

  },
  { timestamps: true }
);

module.exports = model("assignment", AssignmentSchema);
