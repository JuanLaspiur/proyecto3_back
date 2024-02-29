const mongoose = require("mongoose");

const MovementsScheme = new mongoose.Schema(
  {
    contract: {
      type: mongoose.ObjectId,
      ref: "contract",
    },
    type: {
      type: String,
      default: "income",
    },
    description: {
      type: String,
    },
    amount: {
      type: Number,
    },
    deleted: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("movement", MovementsScheme);
