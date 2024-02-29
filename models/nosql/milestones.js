const mongoose = require("mongoose");

const MilestoneScheme = new mongoose.Schema(
    {
        task: {
            type: mongoose.ObjectId,
            ref: "task",
        },
        user: {
            type: mongoose.ObjectId,
            ref: "users",
        },
        date: {
            type: String,
        },
        message: String,
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("milestone", MilestoneScheme);