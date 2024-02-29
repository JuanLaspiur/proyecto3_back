const jwt = require('jsonwebtoken')
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const privateKey = process.env.JWT_PRIVATE_KEY

const getToken = (payload) =>{
  return jwt.sign({
    // exp: Math.floor(Date.now() / 1000) + (60 * 60),
    data: payload
  }, privateKey)
}

const getTokenData = (token) =>{
  let data = null
  jwt.verify(
    token,
    privateKey,
    (err, decoded) => {
      if(err) {
        console.log('Error al obtener data del token', err)
      } else {
        data = decoded
      }
    }
  )
  return data;
}
module.exports = {
  getToken,
  getTokenData
}