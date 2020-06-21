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
      default: "student",
      enum: ["student", "teacher", "parent","admin"]
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
    }
  },
  { timestamps: true }
);

module.exports = model("users", UserSchema);
