const mongoose = require('mongoose');
const { Schema } = mongoose;

const CompanySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    rnc: {
        type: String,
        required: true,
        unique: true
    }, active: {
        type: Boolean,
        default: true
    }
});

const Company = module.exports = mongoose.model('Company', CompanySchema);