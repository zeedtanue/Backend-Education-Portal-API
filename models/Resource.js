const { Schema, model } = require("mongoose");

const ResourceSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    details:{
        type:String,
        required:true
    },
    teacher:{
      type:Schema.Types.ObjectId,
      ref: 'teacher'
    },
    class:{
      type:Schema.Types.ObjectId,
      ref: 'class'
    },
    resourceFile:{
        type:String,
        required:false
    }
    

  },
  { timestamps: true }
);

module.exports = model("resource", ResourceSchema);
