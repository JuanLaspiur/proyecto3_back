const mongoose = require('mongoose')

const PositionScheme = new mongoose.Schema(
  {
    area: {
      type: mongoose.ObjectId,
      ref: 'area'
    },
    departament: {
      type: mongoose.ObjectId,
      ref: 'departament'
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

module.exports = mongoose.model('position', PositionScheme)