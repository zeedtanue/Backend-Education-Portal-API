const { Schema, model } = require("mongoose");

const ClassSchema = new Schema(
  {
    subject: {
      type: String,
      required: true
    },
    teacher:{
      type:Schema.Types.ObjectId,
      ref: 'teacher'
    },
    assignments:[{
      type:Schema.Types.ObjectId,
      ref: 'assignment'
    }],
    resource:[{
      type:Schema.Types.ObjectId,
      ref:'resource'
    }],
    section:[{
      type:Schema.Types.ObjectId,
      ref: 'section'
    }],

  },
  { timestamps: true }
);

module.exports = model("class", ClassSchema);
