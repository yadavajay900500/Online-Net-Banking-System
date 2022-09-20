
const userschema = require("../Models/user_shema");
const { generate_token } = require("../Token/jwt_token");
const { response } = require("../server");
const { sendMobileSMS } = require("../Utilities/twilioSMS.utility");
const bcrypt = require("bcrypt");
const jwt_decode = require('jwt-decode');
const { result } = require("@hapi/joi/lib/base");
const { googleDrive, generatePublicUrl } = require("../Utilities/googleApi.utility")
//const express_validation=require(express_validation);
const saltRounds = 2



exports.signupForExamination = async (req, res, next) => {
  req.body.phone = "+91" + req.body.phone
  req.body.status = "review"
  req.body.statusBy = ""
  const { phone, email, password } = req.body
  const count=await userschema.count()
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>??????????????",count)
  console.log("AAAAA",req.body)
  console.log("AAAAA777777777777777777",req.file)
  const { path } = req?.file || ""
  console.log(">>>>>>>>>>",path)
  req.body.studentImage = path || ""
  const im = googleDrive(req.file)
  const publicUrl = await generatePublicUrl()
  const { webViewLink } = publicUrl
  req.body.studentImage = webViewLink
  const hass = await bcrypt.hash(password, saltRounds);
  req.body.password = hass
  let val = Math.floor(1000 + Math.random() * 9000);
  req.body.otp = val
  const msg = `Hello friends! verification code ${val}`
  const db_email = await userschema.findOne({ email: email })
  if (db_email) {
    const { isVerified } = db_email
    if (isVerified == 1) {
      res.send("User Already Exist Please Signin");
    } else {
      try {
        const verifyAccount = generate_token(result._id, `${60 * 10}s`);
        //req.body.otpExpireTime = verifyAccount;
        console.log("1234567////", req.body)
       //const smsresult = await sendMobileSMS(msg, phone);
        const newData = await  userschema.updateMany({ email }, {
          $set: {
            otp:val,
            otpExpireTime:verifyAccount
          }
        })
        console.log("newData",newData)
        res.status(200).send("otp are send in your register Mobile No")
      }
      catch (err) {
        console.log("Some Error in registrationForm.controller.js File",err)
        res.status(402).send("Some Error in registrationForm.controller.js File")
      }
      // newData.save((err,result)=>{
      //   if(err){
      //   console.log("error in body")
      //   }

    }


    //  await userschema(req.body).save(async (err) => {
    //     if (err) {
    //       next(new Error("data not saved"))
    //     }
    //   });
    //   console.log("newData",newData)
    //   res.status(200).send("otp send your register mobile no");
  }
 else {
  await userschema(req.body).save(async (err, result) => {
    if (err) {
      next(new Error("Data not saved"));
    }
    const verifyAccount = generate_token(result._id, `${60 * 10}s`);
    result.otpExpireTime = verifyAccount
    console.log("resigtrationResult", result)
    const smsresult = await sendMobileSMS(msg, phone)
    result.save()
    res.status(200).send({ data: result });
  })
}
};



exports.signupVarifycation = async (req, res, next) => {
  const { otp } = req.body
  const { _id, email } = req.query;
  
  userschema.findOne({ _id }, async (err, result) => {
    if (err) {
      next(err)
    } if (result) {
      //*********************************************/

      

    



      //************************************************ */
      console.log(".>>>>>>", result)
      const { _id } = result
      var dateNow = new Date();
      const tok = result.otpExpireTime
      const expireTokenTime = jwt_decode(tok).exp
      console.log("Toookeeeen", expireTokenTime)
      if (expireTokenTime > dateNow.getTime() / 1000) {
        if (otp == result.otp) {
          console.log("OTP VERIFY", otp)
          const updateAccount = await userschema.findByIdAndUpdate(_id, { isVerified: 1 }, { new: true })
          res?.status(200).send({ msg: "You has been successfully registered", data: updateAccount });
        } else {
          res.status(500).send({ msg: 'otp is incorrect' });
        }
      } else {
        res.status(403).send("otp time Expire")
      }
    }
  })
}
exports.verifyByOrganization = async (req, res) => {
  const { _id } = req.query;
  const { statusBy, role, status } = req.body.action
  const detail = await userschema.findOneAndUpdate({ _id }, {
    $set: {
      action: {
        role: role,
        status: status, 
        statusBy: statusBy
      },

    }
    
  }, { new: true })
  detail.save(async(err, result) => {
    if (result) {
      const count=await userschema.count()
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>??????????????",count)
    let char = '2022'
      console.log(char+('00000000111'+count).slice(-12))
      const acountNo=char+('00000000111'+count).slice(-12)
    await userschema.updateOne({_id},{
      bankAccountNo:acountNo
    },{new:true})
      console.log("+++++++++++++++++++")
      res.status(200).send({ detail, msg: "approved succesfully" })
    } else {
      res.status(400).send(err)
    }
  })
}
exports.getuserController = async (req, res) => {
  const { city, gender, category, _id} = req.query

  await userschema.find({_id})
    .then(user => {
      console.log(user);
      if (user) {
        res.status(200).send({ user })
      }
      else {
        console.log('user Does Not Exits');
      }
    })
}

exports.signinForExamination = async (req, res) => {
  console.log("eeeeeee",req.body)
  const {bankAccountNo}=req.body
  const userAccount = await userschema.findOne({bankAccountNo})
  console.log("db_email", userAccount)
  const verification = userAccount.isVerified
  console.log("vvccccccccccccc",verification)
  if (!verification) {
    res.send({ varify_Status: " please verify your  bbbbb account" })
  }
  else {
    const match_pass = await bcrypt.compare(req.body.password, userAccount.password)
    if (match_pass) {
      const token = generate_token(req.body?.userAccount);
      res.status(200).send({ userInfo:userAccount, token });
    } else {
      res.status(400).send("Wrong Password")
    }
  }
}



exports.forgatPassword = async (req, res) => {
  var email = req.body.email
  const data = await userschema.findOne({ email: email }, { isVerified: 0 }, { new: true })
  const { phone } = data
  if (data) {
    var val = Math.floor(1000 + Math.random() * 9000);
    const msg = `Hello friends! verification code ${val}`
    const verifyAccount = generate_token(data.email, `${60 * 10}s`);
    const smsresult = await sendMobileSMS(msg, phone);
    data.otpExpireTime = verifyAccount
    data.otp = val
    const newData = new userschema(data)
    newData.save(function (err, result) {
      if (err) {
        console.log(err);
      }
      else {
        res.status(200).send({ Forget_your_password: result })
      }
    })
  } else {
    res.status(404).send("Data not found")
  }
}
exports.newPassword = async (req, res) => {
  const { email, password } = req.body;
  const detail = await userschema.findOneAndUpdate({ email }, { password: password }, { new: true })
  const hass = await bcrypt.hash(password, saltRounds);
  detail.password = hass
  detail.save((err, result) => {
    if (result) {
      res.status(200).send({ detail, msg: "Password is successfully Forgete" })
    } else {
      res.status(400).send(err)
    }

  })

}