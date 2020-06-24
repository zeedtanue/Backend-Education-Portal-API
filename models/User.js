const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
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
      default: "student"
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
    parent:[{
      type:Schema.Types.ObjectId,
      ref: "parent"
    }],
    section: [{
      type:Schema.Types.ObjectId,
      ref:"section"
    }]
  },
  { timestamps: true }
);

module.exports = model("users", UserSchema);
