import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from './ThemeContext';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import API_URL from './config';
ChartJS.register(ArcElement, Tooltip, Legend);

const SummaryPage = () => {
    const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: 15 },
  (_, index) => currentYear - index
);

    const { isDarkMode } = useTheme();
    const [filterMonth, setFilterMonth] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        if (filterMonth && filterYear) {
            try {
                const response = await axios.get(`${API_URL}/api/summary?month=${filterMonth}&year=${filterYear}`, { withCredentials: true });
                setIncomes(response.data.incomes);
                setExpenses(response.data.expenses);
                setError(null);
            } catch (err) {
                setError('Error fetching summary data');
                console.error(err);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [filterMonth, filterYear]);

    // Chart data for incomes
    const incomeChartData = {
        labels: incomes.map(item => item.category),
        datasets: [
            {
                label: 'Income',
                data: incomes.map(item => item.amount),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Chart data for expenses
    const expenseChartData = {
        labels: expenses.map(item => item.category),
        datasets: [
            {
                label: 'Expenses',
                data: expenses.map(item => item.amount),
                backgroundColor: [
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className={`flex ${isDarkMode ? 'bg-black' : 'bg-white'} min-h-screen p-5`}>
            <div className={`w-full max-w-4xl mx-auto rounded-lg p-5 shadow-lg ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <h2 className="text-2xl font-semibold mb-4">Monthly Summary</h2>

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

  {years.map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>

                </div>

                <button
                    onClick={fetchData}
                    className={`py-2 px-4 rounded-md transition duration-300 ${isDarkMode ? 'bg-white text-black hover:bg-gray-600' : 'bg-black text-white hover:bg-blue-700'}`}
                >
                    Get Summary
                </button>

                {error && <p className="text-red-500">{error}</p>}

                <div className="flex space-x-4 mt-4">
                    {/* Income Table */}
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold">Incomes</h2>
                        {incomes.length > 0 ? (
                            <>
                                <table className="min-w-full mt-2 border border-gray-300">
                                    <thead>
                                        <tr>
                                            <th className="border-b p-2">Category</th>
                                            <th className="border-b p-2">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {incomes.map((income) => (
                                            <tr key={income._id}>
                                                <td className="border-b p-2">{income.category}</td>
                                                <td className="border-b p-2">{income.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <h3 className="text-lg font-semibold mt-4">Income Distribution</h3>
                                <Pie data={incomeChartData} />
                            </>
                        ) : (
                            <p>No incomes found for this month.</p>
                        )}
                    </div>

                    {/* Expense Table */}
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold">Expenses</h2>
                        {expenses.length > 0 ? (
                            <>
                                <table className="min-w-full mt-2 border border-gray-300">
                                    <thead>
                                        <tr>
                                            <th className="border-b p-2">Category</th>
                                            <th className="border-b p-2">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expenses.map((expense) => (
                                            <tr key={expense._id}>
                                                <td className="border-b p-2">{expense.category}</td>
                                                <td className="border-b p-2">{expense.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <h3 className="text-lg font-semibold mt-4">Expense Distribution</h3>
                                <Pie data={expenseChartData} />
                            </>
                        ) : (
                            <p>No expenses found for this month.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryPage;
