// Report.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import { useTheme } from './ThemeContext';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, BarElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const Report = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [savingsData, setSavingsData] = useState({ incomes: [], expenses: [] });
  const [selectedYear, setSelectedYear] = useState('');
  const [years, setYears] = useState([]);
  const [showIncomeVsExpense, setShowIncomeVsExpense] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/savings', { withCredentials: true });
        setSavingsData(response.data);

        const uniqueYears = [
          ...new Set([
            ...response.data.incomes.map(item => new Date(item.date).getFullYear()),
            ...response.data.expenses.map(item => new Date(item.date).getFullYear()),
          ]),
        ];

        setYears(uniqueYears);
        if (uniqueYears.length > 0) {
          setSelectedYear(uniqueYears[0]);
        }
      } catch (error) {
        console.error('Error fetching savings data:', error);
      }
    };

    fetchData();
  }, []);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const filteredIncomes = savingsData.incomes.filter(item => new Date(item.date).getFullYear() === parseInt(selectedYear));
  const filteredExpenses = savingsData.expenses.filter(item => new Date(item.date).getFullYear() === parseInt(selectedYear));

  const savingsPerMonth = Array(12).fill(0);
  const expensesPerMonth = Array(12).fill(0);

  filteredIncomes.forEach(item => {
    const month = new Date(item.date).getMonth();
    savingsPerMonth[month] += item.amount;
  });

  filteredExpenses.forEach(item => {
    const month = new Date(item.date).getMonth();
    expensesPerMonth[month] += item.amount;
  });

  const dataBar = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Income',
        data: savingsPerMonth,
        backgroundColor: 'rgba(75, 192, 192, 1)',
      },
      {
        label: 'Expenses',
        data: expensesPerMonth,
        backgroundColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  const dataLine = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Yearly Savings',
        data: savingsPerMonth.map((income, index) => income - expensesPerMonth[index]),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 1)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  const optionsLine = {
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)',
      },
    },
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? 'white' : 'black',
        },
      },
    },
  };

  const optionsBar = {
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? 'white' : 'black',
        },
      },
    },
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold mb-4">Savings Report for {selectedYear}</h2>
        
      </div>

      <div className="flex justify-center my-4">
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className={`border p-2 rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-400'}`}
        >
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setShowIncomeVsExpense(true)}
          className={`px-4 py-2 rounded ${showIncomeVsExpense ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
        >
          Income vs Expense
        </button>
        <button
          onClick={() => setShowIncomeVsExpense(false)}
          className={`px-4 py-2 rounded ${!showIncomeVsExpense ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
        >
          Yearly Savings
        </button>
      </div>

      {showIncomeVsExpense ? (
        <Bar data={dataBar} options={optionsBar} />
      ) : (
        <Line data={dataLine} options={optionsLine} />
      )}
    </div>
  );
};

export default Report;
