const { check,body } = require('express-validator');
const user_shema=require('../Models/user_shema')

exports.add_validator = () => {
    return [
      check('password')
        .isLength({ min: 5 })
        .withMessage('must be at least 5 chars long')
        .matches(/\d/)
        .withMessage('must contain a number'),
      check('phone').isLength({max:10}).withMessage('Invalid mobile Number'),
      check('email').isEmail().withMessage("email is invalid in "),
      body('DOB').trim().custom(async(DOB)=>{
       // console.log("1111111111111111")
        const date=new Date()
       const d= date.setHours(0,0,0,0);
        //console.log(d)
      }).withMessage("please valid Date of birth")
      ,check('name').isLength({ max: 10 }).withMessage("Name Length must be less then 10")
    ]
  }
  //isDate({format: 'DD-MM-YYYY'}).
exports.signin_validator= () => {
    return [
      check('password')
        .isLength({ min: 5 })
        .withMessage('must be at least 5 chars long')
        .matches(/\d/)
        .withMessage('must contain a number'),
  
      check('email').custom(async (email, { req }) => {
        const user = req.body
     
        const result = await user_shema.findOne({ email}, { __v: false, _id: false,  });
        
        if (!result) {
          throw new Error("user not exist")
        } else {
          req.body.userInfo = result;
        }
        return true
  
      }),
    ]
  }