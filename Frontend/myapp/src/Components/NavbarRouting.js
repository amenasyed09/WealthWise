import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import ProfilePage from './ProfilePage';
import Navbar from './Navbar';
import IncomeTracker from './IncomeTracker';
import Layout from './Layout';
import ExpenseTracker from './ExpenseTracker';
import { ThemeProvider } from './ThemeContext';
import SummaryPage from './SummaryPage';
import Report from './Report';
import HomePage from './Home';
import AboutPage from './About';
import Auth from './Auth';
function AppLayout({ children }) {
  const location = useLocation();
 
  const hideNavbarLayout =  location.pathname==='/';
  
  return (
    <>

      {!hideNavbarLayout && <Navbar />}
      {!hideNavbarLayout && <Layout>{children}</Layout>}
      {hideNavbarLayout && children}
    </>
  );
}

function NavbarRouting() {
  return (
    <ThemeProvider>
      <Router>
        <AppLayout>
          <Routes>
          <Route path='/home' element={<HomePage/>}></Route>
 
            <Route path="/about" element={<AboutPage />} />
            <Route path="/" element={<Auth />} />
          
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/income" element={<IncomeTracker />} />
            <Route path="/expense" element={<ExpenseTracker />} />
            <Route path='/summary' element={<SummaryPage/>}></Route>
            <Route path='/reports' element={<Report/>}></Route>
          </Routes>
        </AppLayout>
      </Router>
    </ThemeProvider>
  );
}

export default NavbarRouting;
