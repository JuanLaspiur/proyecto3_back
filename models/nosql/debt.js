const mongoose = require("mongoose");

const DebtsScheme = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "cost",
    },
    description: String,
    amount: Number,
    deleted: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
    },
    company_id: {
      type: mongoose.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("debts", DebtsScheme);
