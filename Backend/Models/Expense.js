// models/Expense.js
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    username: { type: String, required: true },  // Assuming you want to associate expenses with a user
    title: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    note: { type: String, required: false },
});

const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;
