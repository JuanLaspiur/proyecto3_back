const mongoose  = require('mongoose')
const { Schema, model } = mongoose
const deepPopulate = require('mongoose-deep-populate')(mongoose)

const ProjectScheme = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'prospect'
    },
    contracts: [{
        type: Schema.Types.ObjectId,
        ref: 'contract'
    }],
    state: {
        type: String,
        enum: ['active', 'closed', 'suspended'],
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
}, {
    timestamps: true,
    versionKey: false
})

ProjectScheme.plugin(deepPopulate)

module.exports = model('Project', ProjectScheme)