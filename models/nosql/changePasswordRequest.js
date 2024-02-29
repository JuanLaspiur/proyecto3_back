const {Schema, model} = require('mongoose');

const changePasswordRequestModel = new Schema({
    code: String,
    state: String,
    email: String
}, {
    timestamps: true
});

module.exports = model('changePasswordRequest', changePasswordRequestModel);