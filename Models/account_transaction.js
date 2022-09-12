const Mongoose = require('mongoose');
const transaction_schema =  Mongoose.Schema({
    email: {
       type: String,
       require: true,
    },
   amount:{
        type:Number
   },
   accountNo:{
    tpye:Number
   },
    phone: {
       type: String,
       required: true,
    },
    transaction:{

    },
    isVerified:0,
    created_on: {
       type: Date,
       default: new Date()
    },
    updated_on: {
       type: Date,
       default: new Date()
    },
 });
 
 const transactionSchema = Mongoose.model("transactionHistory", transaction_schema);
 
 module.exports = transactionSchema