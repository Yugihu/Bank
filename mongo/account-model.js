const { Schema, Types, model } = require('mongoose')

const actionSchema = new Schema({
    type: String,
    amount: Number,
    from: {
        type: Schema.Types.ObjectId,
        ref: 'account',
        require: false
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'account',
        require: false
    },
    date: Date,
    default: Date.now
})

const accountSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 500
    },
    credit: {
        type: Boolean,
        default: true
    },
    actions: [actionSchema]
})

module.exports.Accounts = model('account', accountSchema)