const mongoose = require('mongoose')

const ProspectScheme = new mongoose.Schema(
  {
    type: {
      type: Number
    },
    typeLabel: {
      type: String
    },
    name:{
      type: String,
    },
    identificationNumber: {
      type: String
    },
    country: {
      type: String
    },
    city: {
      type: String
    },
    address: {
      type: String
    },
    email: {
      type: String
    },
    phoneNumber: {
      type: String
    },
    personInCharge: {
      type: String
    },
    personEmail: {
      type: String
    },
    personPhoneNumber: {
      type: String
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

ProspectScheme.pre('save', function(next) {
  if (this.type === 0) {
      this.typeLabel = 'Empresa'
      next()
  }
  if (this.type === 1) {
    this.typeLabel = 'Persona natural'
    next()
}
});

module.exports = mongoose.model('prospect', ProspectScheme)