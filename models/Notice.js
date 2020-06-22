const { Schema, model } = require("mongoose");

const NoticeSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    
    publishedAt: {
        type: Date,
        required: true,
        default: Date.now
      },
    cover: {
        type:String,
        required:true
    },

  },
  { timestamps: true }
);

module.exports = model("notice", NoticeSchema);
