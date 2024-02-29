const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const WorkingDayScheme = new Schema(
    {
        day: {
            type: Number,
            required: true
        },
        month: {
            type: Number,
            required: true
        },
        year: {
            type: Number,
            required: true
        },
        entry1: {
            type: String,
            required: true,
        },
        exit1: {
            type: String,
            default: ''
        },
        data1: [
            {
                project: {
                    type: Schema.Types.ObjectId,
                    ref: 'Project'
                },
                message: {
                    type: String,
                    default: ''
                },
                minutes: {
                    type: String
                },
                file: {
                    type: String,
                    default: ''
                }
            }
        ],
        entry2: {
            type: String,
            default: ''
        },
        exit2: {
            type: String,
            default: ''
        },
        data2: [
            {
                project: {
                    type: Schema.Types.ObjectId,
                    ref: 'Project'
                },
                message: {
                    type: String,
                    default: ''
                },
                minutes: {
                    type: String
                },
                file: {
                    type: String,
                    default: ''
                }
            }
        ],
        entry3: {
            type: String,
            default: ''
        },
        exit3: {
            type: String,
            default: ''
        },
        data3: [
            {
                project: {
                    type: Schema.Types.ObjectId,
                    ref: 'Project'
                },
                message: {
                    type: String,
                    default: ''
                },
                minutes: {
                    type: String
                },
                file: {
                    type: String,
                    default: ''
                }
            }
        ],
        totalMinutes: {
            type: String,
            default: ''
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

WorkingDayScheme.plugin(deepPopulate);

module.exports = model('working_day', WorkingDayScheme);