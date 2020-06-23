const { Schema, model } = require("mongoose");

const AdminSchema = new Schema(
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
      default: "admin"
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

module.exports = model("admin", AdminSchema);
