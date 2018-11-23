const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContractSchema = new Schema({
    number: {
        type: String,
        required: true,
        unique: true
    },
    voiceBalance: {
        type: Number,
        default: 0
    },
    dataBalance: {
        type: Number,
        default: 0
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Contract = module.exports = mongoose.model('Contract', ContractSchema);