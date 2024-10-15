import React from 'react';
import { Fade } from 'react-awesome-reveal';

const cardData = [
  {
    imageUrl: '/images/signup.jpg',
    title: 'Set Up Your Profile',
    link: '/profile',
  },
  {
    imageUrl: '/images/img4.jpg',
    title: 'Enter Expenses and Incomes',
    link: '/income',
  },
  {
    imageUrl: '/images/img3.jpg',
    title: 'Get Monthly Summary',
    link: '/summary',
  },
  {
    imageUrl: '/images/img1.jpg',
    title: 'View Your Savings',
    link: '/savings',
  },
];

const HomePage = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-semibold mb-8">Welcome to Your Financial Tracker</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl p-4">
        {cardData.map((card, index) => (
          <Fade key={index} duration={500}>
            <a
              href={card.link}
              className="relative flex flex-col items-center justify-center p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl overflow-hidden border-4 border-transparent transition-all duration-300 ease-in-out hover:border-blue-400 h-72" // Increased height
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${card.imageUrl})`, zIndex: -1 }}
              ></div>
              {/* White overlay for light mode and black overlay for dark mode */}
              <div className="relative z-10 text-center rounded-lg p-4 h-full flex items-center justify-center 
                bg-white bg-opacity-70 text-black dark:bg-black dark:bg-opacity-70 dark:text-white">
                <h2 className="text-xl font-bold">{card.title}</h2>
              </div>
            </a>
          </Fade>
        ))}
      </div>
    </section>
  );
};

export default HomePage;
