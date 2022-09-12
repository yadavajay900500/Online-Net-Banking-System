const accountSid = 'AC756b8d69c8c5cdf1897b1dbb7a5a85f0';
const authToken = '5cff6251e4a9d95206a00d7a935cea5e';
const client = require('twilio')(accountSid, authToken);


exports.sendMobileSMS = async (body, to) => {
      return await client.messages.create({
            body,
            to,
            from: '+19378264312'
      });
}
exports.transactionSMS = async (a, b, c, to) => {
      const ol = a;
      const m = ("m" + ol).slice(-3)
      Acount = ('XXXXXXXXX' + ol).replace(ol, m)
      const msg = await client.messages.create({
            body: `A/c ${Acount} credited INR ${c} Date ${Date()} thru UPI: .Current INR ${b} not u? Fwd this SMS to &3094037324 to block UPI. Download HimalayaBank OnlineWebBank`,
            to,
            from: '+19378264312'
      });
      return msg;
}
exports.transactionSMSDebit = async (a, b, c, to) => {
      const ol = a;
      const m = ("m" + ol).slice(-3)
      Acount = ('XXXXXXXXX' + ol).replace(ol, m)
      const msg = await client.messages.create({
            body: `A/c ${Acount} debited INR ${c} Date ${Date()} thru UPI: .Current INR ${b} if not u? Fwd this SMS to 7309403724 to block UPI. Download HimalayaBank OnlineWebBank`,
            to,
            from: '+19378264312'
      });
      return msg;
}