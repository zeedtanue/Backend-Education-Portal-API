const { Schema, model } = require("mongoose");

const SubmissionSchema = new Schema(
  {
    title: { 
      type: String, 
      required: true
    },
    submittedDate:{
        type: Date,
        required: true,
        default: Date.now
    },
    assignment:{
      type:Schema.Types.ObjectId,
      ref:'assignment'
    },
    class:{
      type: Schema.Types.ObjectId,
      ref:'class'
    },
    student:{
      type:Schema.Types.ObjectId,
      ref: 'user'
    },
    submittedFile: { 
      type: String, 
      required: true
    },
    

  },
  { timestamps: true }
);

module.exports = model("submission", SubmissionSchema);
