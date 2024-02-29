const mongoose = require('mongoose')

const DepartamentScheme = new mongoose.Schema(
  {
    area: {
      type: mongoose.ObjectId,
      ref: 'area'
    },
    name:{
      type: String,
    },
    description:{
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false
    },
    company_id: {
      type: mongoose.ObjectId,
      ref: 'users'
    }
  },
  {
    timestamps:true,
    versionKey:false
  }
);

module.exports = mongoose.model('departament', DepartamentScheme)