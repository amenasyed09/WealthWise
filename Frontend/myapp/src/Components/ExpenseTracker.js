import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTheme } from './ThemeContext';

const ExpenseTracker = () => {
    const { isDarkMode } = useTheme();
    const [expenseTitle, setExpenseTitle] = useState('');
    const [expenseCategory, setExpenseCategory] = useState('');
    const [expenseAmount, setExpenseAmount] = useState(0);
    const [expenseDate, setExpenseDate] = useState(new Date());
    const [note, setNote] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [editExpenseId, setEditExpenseId] = useState(null);
    const [filterMonth, setFilterMonth] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const categories = [
        'Food & Dining',
        'Transportation',
        'Utilities',
        'Rent/Mortgage',
        'Insurance',
        'Health & Fitness',
        'Entertainment',
        'Clothing',
        'Education',
        'Groceries',
        'Travel',
        'Miscellaneous',
    ];
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/expense', { withCredentials: true });
                setExpenses(response.data);
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };

        fetchExpenses();
    }, []);

    const handleFilter = async () => {
        try {
            let query = `http://localhost:5000/api/filter/expense?`;
            if (filterMonth) {
                query += `month=${filterMonth}&`;
            }
            if (filterYear) {
                query += `year=${filterYear}`;
            }
            const response = await axios.get(query, { withCredentials: true });
            setExpenses(response.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newExpense = {
            title: expenseTitle,
            category: expenseCategory,
            amount: expenseAmount,
            date: expenseDate,
            note,
        };

        try {
            if (editExpenseId) {
                const response = await axios.put(`http://localhost:5000/api/expense/${editExpenseId}`, newExpense, { withCredentials: true });
                setExpenses(expenses.map(expense => (expense._id === editExpenseId ? response.data : expense)));
                setEditExpenseId(null);
            } else {
                const response = await axios.post('http://localhost:5000/api/expense', newExpense, { withCredentials: true });
                setExpenses([...expenses, response.data]);
            }

            setExpenseTitle('');
            setExpenseCategory('');
            setExpenseAmount(0);
            setExpenseDate(new Date());
            setNote('');
        } catch (error) {
            console.error('Error adding/updating expense:', error);
        }
    };

    const handleEdit = (expense) => {
        setExpenseTitle(expense.title);
        setExpenseCategory(expense.category);
        setExpenseAmount(expense.amount);
        setExpenseDate(new Date(expense.date));
        setNote(expense.note);
        setEditExpenseId(expense._id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/expense/${id}`, { withCredentials: true });
            setExpenses(expenses.filter(expense => expense._id !== id));
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    return (
        <div className={`flex ${isDarkMode ? 'bg-black' : 'bg-white'} min-h-screen`}>
            <div className={`sticky top-0 p-5 w-1/3 rounded-lg shadow-lg ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <h2 className="text-xl font-semibold mb-4">{editExpenseId ? 'Update Expense' : 'Add New Expense'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Expense Title</label>
                        <input
                            type="text"
                            value={expenseTitle}
                            onChange={(e) => setExpenseTitle(e.target.value)}
                            className={`mt-1 block w-full border rounded-md p-2 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Expense Category</label>
                        <select
                            value={expenseCategory}
                            onChange={(e) => setExpenseCategory(e.target.value)}
                            className={`mt-1 block w-full border rounded-md p-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'}`}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Amount</label>
                        <input
                            type="number"
                            value={expenseAmount}
                            onChange={(e) => setExpenseAmount(e.target.value)}
                            className={`mt-1 block w-full border rounded-md p-2 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Date</label>
                        <DatePicker
                            selected={expenseDate}
                            onChange={(date) => setExpenseDate(date)}
                            className={`mt-1 block w-full border rounded-md p-2 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Notes</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className={`mt-1 block w-full border rounded-md p-2 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
                            rows="3"
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-2 rounded-md transition duration-300 ${isDarkMode ? 'bg-blue-500 text-white hover:bg-gray-600' : 'bg-black text-white hover:bg-blue-700'}`}
                    >
                        {editExpenseId ? 'Update Expense' : 'Add Expense'}
                    </button>
                </form>
            </div>

            <div className={`w-2/3 p-5 overflow-y-auto h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <h2 className="text-2xl font-semibold mb-4">Expenses</h2>

                <div className="flex space-x-4 mb-4">
                    <select
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                        className={`border p-2 rounded-md ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
                    >
                        <option value="">Select Month</option>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>

                    <select
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        className={`border p-2 rounded-md ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
                    >
                        <option value="">Select Year</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                    </select>

                    <button
                        onClick={handleFilter}
                        className={`py-2 px-4 rounded-md transition duration-300 ${isDarkMode ? 'bg-blue-500 text-white hover:bg-gray-600' : 'bg-black text-white hover:bg-blue-700'}`}
                    >
                        Filter
                    </button>
                </div>

                {expenses.length === 0 ? (
                    <p className="text-gray-500">No expenses recorded. Please add an expense.</p>
                ) : (
                    <ul className="space-y-4">
                        {expenses.map((expense) => (
                            <li key={expense._id} className={`border rounded-lg p-4 shadow-md ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}>
                                <h3 className="text-lg font-semibold">{expense.title}</h3>
                                <p>Category: {expense.category}</p>
                                <p>Amount: ₹{expense.amount}</p>
                                <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
                                {expense.note && <p>Notes: {expense.note}</p>}
                                <div className="flex space-x-4 mt-4">
                                    <button
                                        onClick={() => handleEdit(expense)}
                                        className={`py-2 px-4 rounded-md transition duration-300 ${isDarkMode ? 'bg-blue-500 text-white hover:bg-gray-600' : 'bg-black text-white hover:bg-blue-700'}`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(expense._id)}
                                        className={`py-2 px-4 rounded-md transition duration-300 ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'}`}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ExpenseTracker;
