const AccountTransactionRoutes = require('express').Router();
const app = require('../server');

const {personalLoan} = require('../Controllers/applyNow.controller');



(()=>{
    post_requests();

})();

function post_requests(){
    AccountTransactionRoutes.patch("/applyForPersionalLoan",personalLoan)
   
}




module.exports = AccountTransactionRoutes