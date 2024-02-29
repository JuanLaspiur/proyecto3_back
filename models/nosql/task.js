const mongoose = require("mongoose");

const TaskScheme = new mongoose.Schema(
  {
    activity: {
      type: String,
    },
    description: {
      type: String,
    },
    date: {
      type: String,
    },
    finished: {
      type: Boolean,
      default: false
    },
    review: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    company_id: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    inProcess: {
      type: Boolean,
      default: false,
    },
    employee: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    activities: [{
      name: String,
      done: Boolean,
    }],
    contract: {
      type: mongoose.ObjectId,
      ref: "contract",
    },
    milestones: [{
      type: mongoose.ObjectId,
      ref: "milestone",
    }],
    stopper: {
      type: Boolean,
      default: false,
    },
    employees: [{
      type: mongoose.ObjectId,
      ref: "users",
    }],
    project: {
      type: mongoose.ObjectId,
      ref: "Project",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("task", TaskScheme);
