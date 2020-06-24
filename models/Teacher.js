const { Schema, model } = require("mongoose");

const TeacherSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "teacher"
    },
    userid: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    
    profileImage: { 
      type: String, 
      required: false
    },
    classes: [{
        type:Schema.Types.ObjectId,
        ref:'class'
    }]//1 teacher will have multiple classes
  },
  { timestamps: true }
);

module.exports = model("teacher", TeacherSchema);
