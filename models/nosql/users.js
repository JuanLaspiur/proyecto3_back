const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const APP_HOST = process.env.APP_HOST
const PORT = process.env.PORT

const UserScheme = new mongoose.Schema(
  {
    email:{
      type:String,
      required: true,
      unique: true
    },
    password:{
      type: String,
      required: true
    },
    role:{
      type: [Number]
    },
    name:{
      type: String,
    },
    profileImage: {
      type: String
    },
    company_id: {
      type: mongoose.ObjectId,
      ref: 'users'
    },
    discordId: String,
    employees: [{
      type: mongoose.ObjectId,
      ref: 'users'
    }], // ! Solo para las empresas
    
    cellphone: String, // ! Solo para los empleados
    civilStatus: String, // ! Solo para los empleados
    city: String, // ! Solo para los empleados
    country: String, // ! Solo para los empleados
    address: String, // ! Solo para los empleados
    identificationNumber: String, // ! Solo para los empleados
    genre: String, // ! Solo para los empleados
    birthDate: String, // ! Solo para los empleados
    age: Number, // ! Solo para los empleados
    area: {
      type: mongoose.ObjectId,
      ref: 'area'
    }, // ! Solo para los empleados
    position: {
      type: mongoose.ObjectId,
      ref: 'position'
    }, // ! Solo para los empleados
    department: {
      type: mongoose.ObjectId,
      ref: 'departament'
    }, // ! Solo para los empleados
    workingDays: [{
      type: mongoose.ObjectId,
      ref: 'working_day'
    }], // ! Solo para los empleados
    salaryPerHour: Number, // ! Solo para los empleados
  },{
    timestamps:true,
    versionKey:false
  }
);

UserScheme.pre('save', function(next) {
  if (this.role[0] === 1) {
    this.company_id = this._id
  }
  if (this.isModified('password')) {
    bcrypt.hash(this.password, saltRounds, (err, hashedPassword) => {
      if (err) return next(err)
      this.password = hashedPassword
      next()
    })
  }
  if(!this.profileImage){
    this.profileImage = `${APP_HOST}:${PORT}/default/user_default.png`
  }
});

UserScheme.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};

UserScheme.methods.comparePassword = async function(password){
  if(!password) throw new Error('Password is miss can not compare!')
  try {
    const result = await bcrypt.compare(password, this.password)
    return result
  } catch (error) {
    console.log('Error while comparing password!', error.message)
  }
}

UserScheme.methods.setProfileImage = function (filename) {
  if(filename){
    this.profileImage = `${APP_HOST}:${PORT}/storage/${filename}`
  } else {
    this.profileImage = `${APP_HOST}:${PORT}/default/user_default.png`
  }
}

module.exports = mongoose.model("users", UserScheme)