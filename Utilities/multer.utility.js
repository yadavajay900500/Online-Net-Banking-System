
const path = require('path');
const fs = require('node:fs/promises');
const express = require("express");
const multer  = require('multer')
 const app = express();
//const {googleDrive}=require('../Utilities/googleApi.utility')

 const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() 
      cb(null,uniqueSuffix+file.originalname)
    }
  })
  function fileFilter (req, file, cb) {
    const file1=file
  
    if(file.mimetype==="image/jpeg" || file.mimetype==="image/jpg" ||file.mimetype==="image/png"){
      cb(null,true)
    }else{
      cb(null,false)
    }
  }

const upload = multer({ 
  storage:storage,
  limits:{
    fieldSize:1025*1024*10
  },
  fileFilter:fileFilter
})
console.log("--------------------")
console.log("multerFile",upload)

// const im=googleDrive()

module.exports=upload