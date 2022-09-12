
const binary = require('@hapi/joi/lib/types/binary');
const Mongoose = require('mongoose');

const user_schema = Mongoose.Schema({

   // _id:Mongoose.Schema.Types.ObjectId,
   onlyForNo: {
      type: Number
   },
   index:0,
   bankName: {
      type: String,
      // required:true,
   },
   IFSCCODE: {
      type: String,
      // required:true,
   },
   bankBranch: {
      type: String,
      // required:true,
   },
   bankAccountNo: {
      type: Number
   },
   transactionHistory: {
      type:Array

   },
   email: {
      type: String,
      //require: true,
   },
   password: {
      type: String
   },
   name: {
      type: String,
      //required: true,
   },
   DOB: {
      type: Date
   },
   gender: {
      type: String,
      //required:true,
   },
   studentImage: {
      //  require:true
   },
   father: {
      type: String,
      //  required:true,

   },
   mother: {
      type: String,
      // required:true,

   },
   education: {
      type: String,
      //required:true,
   },

   phone: {
      type: String,
      //  required: true,
   },

   otp: {
      type: Number,
   },
   otpExpireTime: {
      type: String
   },
   age: {
      type: Number,
      //required:true,
   },
   addressprov: {
      type: String,
      // required: true,

   },
   category: {
      type: String,
      //  required: true,

   },
   isVerified: 0,
   created_on: {
      type: Date,
      // default: new Date()
   },
   totalAmount: {
      type: Number
   },
   previuousAmount: {
      type: Number
   },
   updated_on: {
      type: Date,
      //default: new Date()
   },
   action: {
      status: {
         type: String,
         //default:[],
      },
      statusBy: {
         type: String,
         //default: [],
      },
      role: {
         type: String,
         //   required:true,

      }
   },


});

const userschema = Mongoose.model("registrationDetails", user_schema);

module.exports = userschema;