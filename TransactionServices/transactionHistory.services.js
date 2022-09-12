const userschema = require("../Models/user_shema");
var mongoXlsx = require('mongo-xlsx');



exports.transactionHistory = async ( credit,debit, amount) => {
    debit = debit ? debit: 0
    credit = credit ? credit : 0
    const id = Date.now()
    const idFinal = ('Ajy' + id).slice(-9)
    const transactiondetails = `Hello Every One`
    const dataHistory = {
        transactionId: idFinal, debitAmount: debit, creditAmount: credit,
        transactionDescription: transactiondetails, previuousAmount: amount, transactionDate: Date()
    }
    return dataHistory;



}

exports.excelFile=async(a)=>{
  
    const file=await userschema.find({_id:a})
    const transaction=file?.map((v)=>v?.transactionHistory)
    const model = mongoXlsx.buildDynamicModel(transaction);
  return  new Promise((resolve,reject)=>{
        mongoXlsx.mongoData2Xlsx(transaction, model, function(err, transaction) {
            resolve(transaction)
        })
       // console.log('File saved at:'); 
      });

}

