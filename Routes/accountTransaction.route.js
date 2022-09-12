const AccountTransactionRoutes = require('express').Router();
const app = require('../server');

const {amountCredit,amountCreditByCashier,debitMoneyByCashier,transactionByATMCard, excelFilej,} = require('../Controllers/accountTransaction.controller');
//const { excelFile } = require('../TransactionServices/transactionHistory.services');

(()=>{
    post_requests();
    get_requests();

})();

function post_requests(){
    AccountTransactionRoutes.patch("/transaction",amountCredit)
    AccountTransactionRoutes.patch("/transationByCashier",amountCreditByCashier)
    AccountTransactionRoutes.patch("/debitAnount",debitMoneyByCashier)
    AccountTransactionRoutes.patch("/transactionByATM",transactionByATMCard)
}

function get_requests(){
    AccountTransactionRoutes.get("/findExcel", excelFilej)

}




module.exports = AccountTransactionRoutes