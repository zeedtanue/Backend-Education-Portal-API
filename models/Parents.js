const { Schema, model } = require("mongoose");

const ParentsUserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique:true
    },
    role: {
      type: String,
      default: "parent",
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
    user:[{
        type:Schema.Types.ObjectId,
        ref: "users"
    }]//1 user may have multiple students
  },
  { timestamps: true }
);

module.exports = model("parent", ParentsUserSchema);
