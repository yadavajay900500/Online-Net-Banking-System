const SigninSignupRoutes = require('express').Router();
const app = require('../server');
const { signupForExamination, signinForExamination, signupVarifycation, getuserController, verifyByOrganization ,forgatPassword,newPassword} = require('../Controllers/registrationForm.controller');
const { add_validator, signin_validator } = require('../Validation/user_validation');
const { token_parser } = require('../Token/jwt_token')
const uploadImage = require('../Utilities/multer.utility')
const { result_validator } = require('../Middleware/globalmiddleware');
// const {upload}=require('../Utilities/googleApi.utility')

(() => {
  post_requests();

  patch_requests();
  //  patch_requests();
  get_requests();
  //  delte_requests();
  delete_requests();
})();
function post_requests() {

  SigninSignupRoutes.post("/signup", uploadImage.single('studentPhoto'),add_validator(), result_validator, signupForExamination);
  SigninSignupRoutes.post("/signin", signin_validator(), result_validator, signinForExamination);
  SigninSignupRoutes.post('/ForgetPassword',forgatPassword)
}
function patch_requests() {

  SigninSignupRoutes.patch("/otpVarifycation", signupVarifycation);
  SigninSignupRoutes.patch("/verifyAccount", verifyByOrganization)
  SigninSignupRoutes.patch("/newPassword", newPassword)

}
function get_requests() {

  SigninSignupRoutes.get("/find", getuserController);

}
function delete_requests(){
  SigninSignupRoutes.post('/ForgetPassword',forgatPassword)
}
module.exports = SigninSignupRoutes