const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentMethodSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    cvv: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    expiration: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String
    }
});

PaymentMethodSchema.index({user: 1, number: 1}, {unique: true});

const PaymentMethod = module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);