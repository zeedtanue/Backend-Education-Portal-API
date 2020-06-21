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
      items     :   [{name      : {type : String, required : true},
        values  : [String],
        price   : {type : Number, required : true},
        uploadRequired : {type : Boolean, required : true, default : false},
        files   : [{
            url     : {type : String},
            filename: {type : String}
        }]}],

    
    logo: {
        file_name: { type: String, maxlength: 250 },
        url: { type: String },
    },
    videos: { type: Array },
    images: { type: Array },
    


  },
  { timestamps: true }
);

module.exports = model("books", BookSchema);
