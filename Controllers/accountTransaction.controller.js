const { MongoClient } = require('mongodb');
const  cron = require('node-cron');
const { result } = require("@hapi/joi/lib/base");
const transactionSchema = require("../Models/account_transaction");
const userschema = require("../Models/user_shema");
const { transactionSMS, sendMobileSMS ,transactionSMSDebit} = require("../Utilities/twilioSMS.utility");
const {transactionHistory,excelFile}=require("../TransactionServices/transactionHistory.services")

exports.amountCredit = async (req, res) => {

    const session = await userschema.startSession();
    try {
        //  req.body.phone = "+91" + req.body.phone
        const { _id, bankAccountNo } = req.query
        const { amountCradit } = req.body
        const findAccountDetails = await userschema.find({ _id, bankAccountNo })
        console.log("FindUserDeatilsFromBank", findAccountDetails)
        const [amountData] = findAccountDetails
        const previuousAmount = amountData.totalAmount
        const phoneNo = amountData.phone
        const updatedAmount = previuousAmount + amountCradit
        //console.log("newAmount", updatedAmount, previuousAmount, amountCradit)
       // findAccountDetails[0].totalAmount = updatedAmount
        console.log("start from here")
        session.startTransaction();

        const newAm = await userschema.updateOne({ _id }, {
            totalAmount: updatedAmount,
            previuousAmount: previuousAmount
        }, { session });
        console.log("wrrrrrrrrrr", newAm)
        const user = new userschema(newAm);
        console.log(">>>>>>>>", user)
        await user.save({ session },async(err,result)=>{
             if(err){
                console.log("Something")
                res.status(403).send("Something is wrong")
             }
             await session.commitTransaction();
             res.status(203).send(result)
             
        });
        /***   It work but this time disable services  ********************************  */

        // const smsresult = await transactionSMS(bankAccountNo, updatedAmount, amountCradit, phoneNo);
        // console.log("||||||||||||||||||||", smsresult)

        // await session.commitTransaction();
       // console.log("All good")
        //res.status(203).send("Transaction Successfule")
    } catch (error) {
        console.log("Something is wrong", error)
        await session.abortTransaction();
        session.endSession();
        res.status(203).send("Transaction is Failed")
    }
}

exports.amountCreditByCashier = async (req, res) => {
    const { _id, bankAccountNo } = req.query
    const { amountCradit } = req.body

    //const d=excelFile(_id)

    const findAccountDetails = await userschema.find({ _id, bankAccountNo })
    console.log("FindUserDeatilsFromBank", findAccountDetails)
    const [amountData] = findAccountDetails
    const previuousAmount = amountData.totalAmount
    const updatedAmount = previuousAmount + amountCradit
    console.log("newAmount", updatedAmount, previuousAmount, amountCradit)
    findAccountDetails[0].totalAmount = updatedAmount
    const transactionH=transactionHistory(amountCradit,"",previuousAmount)
    console.log("!!!!!!!!!!!!!!!!!!!",transactionH)
    const newAmount = await userschema.updateOne({ _id ,bankAccountNo}, {
        $set: {
            totalAmount: updatedAmount,
            previuousAmount: previuousAmount
            
        },
        $push:{
            transactionHistory:await transactionH
        }
    })
   
 
    
    const newData = new userschema(newAmount)
    newData.save((err, result) => {
        if (err) {
            console.log("err", err)
        }
        if (result) {
            
            console.log("Transaction Successfule")
        }
    })
    console.log(">>>>>>", newAmount)
    res.status(203).send("Money is added Successfully")

}

exports.debitMoneyByCashier = async (req, res) => {
    const { _id, bankAccountNo } = req.query
    const { debitAmount } = req.body
    const findAccountDetails = await userschema.find({ _id, bankAccountNo })
    console.log("FindUserDeatilsFromBank", findAccountDetails)
    const [amountData] = findAccountDetails
    const previuousAmount = amountData.totalAmount
    const phoneNo = amountData.phone
    const updatedAmount = previuousAmount - debitAmount
    console.log("newAmount", updatedAmount, previuousAmount, debitAmount)
    findAccountDetails[0].totalAmount = updatedAmount
    const newAmount = await userschema.updateOne({ _id }, {
        $set: {
            totalAmount: updatedAmount,
            previuousAmount: previuousAmount
        }
    })
    const newData = new userschema(newAmount)
    newData.save(async (err, result) => {
        if (err) {
            console.log("err", err)
        }
        if (result) {
            const smsresult = await transactionSMSDebit(bankAccountNo, updatedAmount, debitAmount, phoneNo);
            console.log("Transaction Successfule")
            res.status(203).send("Money is Debited Successfully")
        }
    })
   
}


exports.transactionByATMCard=async (req,res)=>{

        const {atmCardNo}=req.query
        const {pinNo,accountType}=req.body

}



exports.excelFilej=async(req,res)=>{
    const {_id}=req.query
    const d=await excelFile(_id)
    console.log("??>>?????",d)
    res.status(203).send(d)
}