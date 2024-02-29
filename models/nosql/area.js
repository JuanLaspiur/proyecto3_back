const mongoose = require('mongoose')

const AreaScheme = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
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

module.exports = mongoose.model('area', AreaScheme)