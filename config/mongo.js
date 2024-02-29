const mongoose = require('mongoose')
require('colors')
const dbConnect = ()=>{
  const DB_URI = process.env.DB_URI
  mongoose.connect(DB_URI, {
    useNewUrlParser:true,
    useUnifiedTopology:true
  },
  (err,res)=>{
    if(!err){
      console.log('**** DB connected ****'.bgGreen)
    } else{
      console.log('**** DB connection error ****'.bgRed)
    }
  })
}


module.exports = dbConnect