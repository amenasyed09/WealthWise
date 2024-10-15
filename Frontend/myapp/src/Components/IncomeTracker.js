import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTheme } from './ThemeContext';

const IncomeTracker = () => {
    const { isDarkMode } = useTheme();
    const [incomeTitle, setIncomeTitle] = useState('');
    const [incomeCategory, setIncomeCategory] = useState('');
    const [incomeAmount, setIncomeAmount] = useState(0);
    const [incomeDate, setIncomeDate] = useState(new Date());
    const [note, setNote] = useState('');
    const [incomes, setIncomes] = useState([]);
    const [editIncomeId, setEditIncomeId] = useState(null);
    const [filterMonth, setFilterMonth] = useState('');
    const [filterYear, setFilterYear] = useState('');

    useEffect(() => {
        const fetchIncomes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/income', { withCredentials: true });
                setIncomes(response.data);
            } catch (error) {
                console.error('Error fetching incomes:', error);
            }
        };

        fetchIncomes();
    }, []);

    const handleFilter = async () => {
        try {
            let query = `http://localhost:5000/api/filter/income?`;
            if (filterMonth) {
                query += `month=${filterMonth}&`;
            }
            if (filterYear) {
                query += `year=${filterYear}`;
            }
            const response = await axios.get(query, { withCredentials: true });
            setIncomes(response.data);
        } catch (error) {
            console.error('Error fetching incomes:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newIncome = {
            title: incomeTitle,
            category: incomeCategory,
            amount: incomeAmount,
            date: incomeDate,
            note,
        };

        try {
            if (editIncomeId) {
                const response = await axios.put(`http://localhost:5000/api/income/${editIncomeId}`, newIncome, { withCredentials: true });
                setIncomes(incomes.map(income => (income._id === editIncomeId ? response.data : income)));
                setEditIncomeId(null);
            } else {
                const response = await axios.post('http://localhost:5000/api/income', newIncome, { withCredentials: true });
                setIncomes([...incomes, response.data]);
            }

            setIncomeTitle('');
            setIncomeCategory('');
            setIncomeAmount(0);
            setIncomeDate(new Date());
            setNote('');
        } catch (error) {
            console.error('Error adding/updating income:', error);
        }
    };

    const handleEdit = (income) => {
        setIncomeTitle(income.title);
        setIncomeCategory(income.category);
        setIncomeAmount(income.amount);
        setIncomeDate(new Date(income.date));
        setNote(income.note);
        setEditIncomeId(income._id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/income/${id}`, { withCredentials: true });
            setIncomes(incomes.filter(income => income._id !== id));
        } catch (error) {
            console.error('Error deleting income:', error);
        }
    };

    return (
        <div className={`flex ${isDarkMode ? 'bg-black' : 'bg-white'} min-h-screen`}>
            <div className={`sticky top-0 p-5 w-1/3 rounded-lg shadow-lg ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <h2 className="text-xl font-semibold mb-4">{editIncomeId ? 'Update Income' : 'Add New Income'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Income Title</label>
                        <input
                            type="text"
                            value={incomeTitle}
                            onChange={(e) => setIncomeTitle(e.target.value)}
                            className={`mt-1 block w-full border rounded-md p-2 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Income Category</label>
                        <select
                            value={incomeCategory}
                            onChange={(e) => setIncomeCategory(e.target.value)}
                            className={`mt-1 block w-full border rounded-md p-2 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Salary">Salary</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Investments">Investments</option>
                            <option value="Rental Income">Rental Income</option>
                            <option value="Dividends">Dividends</option>
                            <option value="Gifts">Gifts</option>
                            <option value="Business Income">Business Income</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Amount</label>
                        <input
                            type="number"
                            value={incomeAmount}
                            onChange={(e) => setIncomeAmount(e.target.value)}
                            className={`mt-1 block w-full border rounded-md p-2 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Date</label>
                        <DatePicker
                            selected={incomeDate}
                            onChange={(date) => setIncomeDate(date)}
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
                        {editIncomeId ? 'Update Income' : 'Add Income'}
                    </button>
                </form>
            </div>

            <div className={`w-2/3 p-5 overflow-y-auto h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <h2 className="text-2xl font-semibold mb-4">Incomes</h2>

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
                        className={`py-2 px-4 rounded-md transition duration-300 ${isDarkMode ? 'bg-blue-700 text-white hover:bg-gray-600' : 'bg-black text-white hover:bg-blue-700'}`}
                    >
                        Filter
                    </button>
                </div>

                {incomes.length === 0 ? (
                    <p className="text-gray-500">No incomes recorded. Please add an income.</p>
                ) : (
                    <ul className="space-y-4">
                        {incomes.map((income) => (
                            <li key={income._id} className={`border rounded-lg p-4 shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <div className="flex justify-between">
                                    <h3 className="text-lg font-semibold">{income.title}</h3>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(income)}
                                            className={`px-3 py-1 rounded-md transition duration-300 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-black text-white hover:bg-gray-600'}`}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(income._id)}
                                            className={`px-3 py-1 rounded-md transition duration-300 ${isDarkMode ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <p>Category: {income.category}</p>
                                <p>Amount: ${income.amount}</p>
                                <p>Date: {new Date(income.date).toLocaleDateString()}</p>
                                {income.note && <p>Note: {income.note}</p>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default IncomeTracker;
