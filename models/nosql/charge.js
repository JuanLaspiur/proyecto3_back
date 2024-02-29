const mongoose = require("mongoose");

const ChargeScheme = new mongoose.Schema(
  {
    contract: {
      type: mongoose.ObjectId,
      ref: "contract",
    },
    type: {
      type: String,
      default: "income",
    },
    description: String,
    amount: Number,
    deleted: {
      type: Boolean,
      default: false,
    },
    date: {
        type: Date,
        required: true
    },
    notify: {
      type: Boolean,
      default: false,
    },
    company_id: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    last_notify: {
      type: String,
      default: null
    },
    count_notify: {
      type: Number,
      default: 0
    },
    alternative_currency: {
      type: String,
      default: 'USD'
    }, 
    alternative_amount: {
      type: Number,
      default: 0
    },
    project: {
      type: mongoose.ObjectId,
      ref: "Project",
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("charge", ChargeScheme);