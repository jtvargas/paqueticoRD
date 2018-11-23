const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    }
});

UserSchema.index({email: 1, company: 1}, {unique: true});

const User = module.exports = mongoose.model('User', UserSchema);