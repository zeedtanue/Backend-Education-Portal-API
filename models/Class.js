const { Schema, model } = require("mongoose");

const ClassSchema = new Schema(
  {
    subject: {
      type: String,
      required: true
    }

  },
  { timestamps: true }
);

module.exports = model("class", ClassSchema);
