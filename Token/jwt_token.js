const  jwt = require('jsonwebtoken');
const secret =  "All_All_Well"
exports.generate_token = (data, expiresIn = "1d",) => {
    return jwt.sign({ data }, `All_All_Well`, { expiresIn });
  };

exports.token_parser = async(req, res, next) => {

  const {token} = req.query;
  try {
    const decoded = await Promise.resolve(jwt.verify(token, secret));
     req.body.token = decoded;
     next();
  } catch (error) {
    next(error);
  }
  
}