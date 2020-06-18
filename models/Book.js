const { Schema, model } = require("mongoose");

const BookSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    summery: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    },
    publishedAt: {
        type: Date,
        required: true,
        default: Date.now
      },
  },
  { timestamps: true }
);

module.exports = model("books", BookSchema);
