const { Schema, model } = require("mongoose");

const SectionSchema = new Schema(
  {
    sectionName: {
      type: String,
      required: true
    },
    student:[{
        type: Schema.Types.ObjectId,
        ref:'users'
    }],//1 section may have multiple students
    classes:[{
        type:Schema.Types.ObjectId,
        ref:'class'
    }]//1 section may have multiple classes

  },
  { timestamps: true }
);

module.exports = model("section", SectionSchema);
