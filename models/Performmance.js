const { Schema, model } = require("mongoose");

const PerformanceSchema = new Schema(
  {
    student:{
      type:Schema.Types.ObjectId,
      ref: 'student'
    },
    mark:[{
        type:string
    }],
    submission:[{

    }]    
    

  },
  { timestamps: true }
);

module.exports = model("performance", PerformanceSchema);
