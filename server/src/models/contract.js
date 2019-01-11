const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChargeSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});


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
    },
    lastRecharge: ChargeSchema
});

const Contract = module.exports = mongoose.model('Contract', ContractSchema);