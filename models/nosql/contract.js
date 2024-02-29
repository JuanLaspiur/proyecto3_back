const mongoose = require("mongoose");

const ContractScheme = new mongoose.Schema(
  {
    prospectOrClient: {
      type: mongoose.ObjectId,
      ref: "prospect",
    },
    type: Number,
    // type: 0 --> prospect
    // type: 1 --> client
    plannings: [
      { 
        type: mongoose.ObjectId,
        ref: "planning", 
    }],
    positionsWithAmount: [{ type: Object }],
    expirationDays: Number,
    status: Number,
    statusLabel: String,
    moneyBadge: String,
    formNumber: {
      type: String,
      default: Date.now().toString(),
    },
    name: String,
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
ContractScheme.pre("save", function (next) {
  if (this.status === 0) {
    this.statusLabel = "Enviado";
    next();
  }
  if (this.status === 1) {
    this.statusLabel = "Aceptado";
    next();
  }
  if (this.status === 2) {
    this.statusLabel = "Rechazado";
    next();
  }
});

module.exports = mongoose.model("contract", ContractScheme);