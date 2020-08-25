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
    classNotice:[{
      comment: {
        type:String
      },
      teacher:{
        type:Schema.Types.ObjectId,
        ref: 'teacher'
      },
      publishedAt: {
        type: Date,
        required: true,
        default: Date.now
      },
    }],
    assignments:[{
      type:Schema.Types.ObjectId,
      ref: 'assignment'
    }],
    resource:[{
      type:Schema.Types.ObjectId,
      ref:'resource'
    }],
    section:{
      type:Schema.Types.ObjectId,
      ref: 'section'
    },

  },
  { timestamps: true }
);

module.exports = model("class", ClassSchema);
