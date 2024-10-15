import React, { useState } from 'react';
import { useTheme } from './ThemeContext'; 

const accordionData = [
  {
    title: 'Profile Settings',
    content: (
      <div>
        <p className="mb-2 text-gray-500">
          Set your profile picture and update your personal information to personalize your experience.
        </p>
        <p className="text-gray-500">Example: Upload a profile image and enter your name and email.</p>
      </div>
    ),
  },
  {
    title: 'Income Entering',
    content: (
      <div>
        <p className="mb-2 text-gray-500">
          Enter your income details, including category, title, date, amount, and notes to keep track of your earnings.
        </p>
        <p className="text-gray-500">Example: "Salary", "Monthly Salary", "2024-10-01", "$2000".</p>
      </div>
    ),
  },
  {
    title: 'Expense Entering',
    content: (
      <div>
        <p className="mb-2 text-gray-500">
          Record your expenses by entering categories, titles, dates, amounts, and notes for better financial management.
        </p>
        <p className="text-gray-500">Example: "Groceries", "Weekly Shopping", "2024-10-05", "$150".</p>
      </div>
    ),
  },
  {
    title: 'Monthly Summary',
    content: (
      <div>
        <p className="mb-2 text-gray-500">
          Generate a monthly summary by inputting the month and year to review your financial activities.
        </p>
        <p className="text-gray-500">Example: View income and expenses for "October 2024".</p>
      </div>
    ),
  },
  {
    title: 'Reports',
    content: (
      <div>
        <p className="mb-2 text-gray-500">
          Access detailed reports to visualize your financial data, including savings over the year and income vs. expenses.
        </p>
        <p className="text-gray-500">Example: View a line graph of monthly savings and a comparison of income vs. expenses.</p>
      </div>
    ),
  },
];

const AboutPage = () => {
  const { isDarkMode } = useTheme(); // Use the theme context
  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-gray-100';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-800';
  
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`flex flex-col items-center justify-center min-h-screen p-6 `}>
      <h1 className={`text-3xl font-semibold mb-6 ${textColor}`}>About This Personal Finance App</h1>
      <div className="w-full max-w-4xl">
        {accordionData.map((item, index) => (
          <div key={index} className="mb-2">
            <button
              onClick={() => toggleAccordion(index)}
              className={`flex justify-between items-center w-full p-4 text-left rounded-lg focus:outline-none bg-gray-800 text-white`}
            >
              <span className="text-lg font-medium">{item.title}</span>
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${openIndex === index ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === index && (
              <div className={`p-4 ${textColor} bg-white ${isDarkMode?'text-black':'text-white'} rounded-lg shadow-md`}>
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutPage;
