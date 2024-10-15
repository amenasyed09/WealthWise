// models/Income.js
const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
    username: { type:String,require:true},
    title: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    note: { type: String, required: false },
});

const Income = mongoose.model('Income', IncomeSchema);

module.exports = Income;
