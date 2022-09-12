const { required } = require("@hapi/joi/lib/base");
const express = require("express");
const multer=require('multer');
const app = express();
const  phone= require('phone-regex');
const Mongoose = require("mongoose");
const  SigninSignupRoutes = require('./Routes/signinsignup.routes');
const  AccountTransactionRoutes = require('./Routes/accountTransaction.route');
const api_version = "api/v1";
const cors = require('cors');



(() => {
  body_parsar();
  cors_config();
  db_config();
    routes_config();
    routes_config_transaction();
    global_Error_Handler();
    


  })();
  function db_config() {
    Mongoose.connect(
      "mongodb+srv://ajay:900@cluster0.umyjcyd.mongodb.net/Bank_Account_Details?retryWrites=true&w=majority",
      (err) => {
        if (!err) {
          console.log("DB Connected Successfully");
        } else {
          console.log("Error: ", err);
        }
      }
    );
  }
   function body_parsar() {
    app.use(express.json());
   
  }
  function cors_config() {
    app.use(cors());
  }
function routes_config(){
    app.use('/', SigninSignupRoutes);
}
function routes_config_transaction(){
  app.use('/', AccountTransactionRoutes);
}
function global_Error_Handler() {
 app.use((err, req, res, next) => {
    const errorStatus = req.status || 500;
     const error = err.message && [err.message] || err || "Internal Server Error";
     res.status(errorStatus).send({error:"pppppppp"})
  })
 }
 module.exports = app;