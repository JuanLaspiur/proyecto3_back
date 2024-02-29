const mongoose = require('mongoose')

const PlanningScheme = new mongoose.Schema(
  {
    name: String,
    description: String,
    steps: [{type: Object}],
    preDelivery: [{type: Object}],
    finalDelivery: [{type: Object}],
    positions: [{
      type: mongoose.ObjectId,
      ref: 'position'
    }],
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

module.exports = mongoose.model('planning', PlanningScheme)