import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import axios from 'axios';
import API_URL from './config';

const Navbar = () => {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false); // State for showing the logout modal
    const navigate = useNavigate(); // For navigating after logout

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        // Show the logout confirmation modal
        setShowLogoutModal(true);
    };

    const confirmLogout = async () => {
        try {
            await axios.delete(`${API_URL}/api/logout`,{withCredentials:true});
            setShowLogoutModal(false);
            navigate('/');  // Redirect to login page after logout
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const cancelLogout = () => {
        setShowLogoutModal(false); // Close the modal if 'No' is clicked
    };

    return (
        <nav className={`sticky top-0 w-full shadow-md z-10 p-4 flex justify-between items-center transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <Link to="/" className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>WealthWise</Link>
            <div className="space-x-4 hidden md:flex">
                <Link to="/" className={`hover:text-blue-500 ${isDarkMode ? 'text-white' : 'text-black'}`}>Home</Link>
                <Link to="/about" className={`hover:text-blue-500 ${isDarkMode ? 'text-white' : 'text-black'}`}>About</Link>
   
                <Link to="/profile" className={`hover:text-blue-500 ${isDarkMode ? 'text-white' : 'text-black'}`}>Profile</Link>
                <button onClick={handleLogout} className={`hover:text-blue-500 ${isDarkMode ? 'text-white' : 'text-black'}`}>Log Out</button>
            </div>
            <button onClick={toggleMobileMenu} className="md:hidden focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
            {isMobileMenuOpen && (
                <div className={`md:hidden p-4 absolute w-full shadow-lg transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <Link to="/" className={`block py-2 hover:text-blue-500 ${isDarkMode ? 'text-white' : 'text-black'}`}>Home</Link>
                    <Link to="/about" className={`block py-2 hover:text-blue-500 ${isDarkMode ? 'text-white' : 'text-black'}`}>About</Link>
                 
                    <Link to="/profile" className={`block py-2 hover:text-blue-500 ${isDarkMode ? 'text-white' : 'text-black'}`}>Profile</Link>
                    <button onClick={handleLogout} className={`block py-2 hover:text-blue-500 ${isDarkMode ? 'text-white' : 'text-black'}`}>Log Out</button>
                </div>
            )}
<button onClick={toggleDarkMode} className="ml-4 focus:outline-none">
    {isDarkMode ? (
        // Moon emoji for dark mode
        <span role="img" aria-label="moon" className="text-yellow-500 text-2xl">🌙</span>
    ) : (
        // Sun emoji for light mode
        <span role="img" aria-label="sun" className="text-yellow-500 text-2xl">☀️</span>
    )}
</button>


            {showLogoutModal && (
                <div className={`fixed inset-0 flex items-center justify-center ${isDarkMode?'text-black':'text-white'} bg-gray-900 bg-opacity-50`}>
                    <div className={` ${isDarkMode?'bg-black':'bg-white'} p-4 rounded-lg shadow-lg`}>
                        <h2 className="text-lg font-semibold">Do you want to log out?</h2>
                        <div className="flex justify-end mt-4 space-x-4">
                            <button
                                onClick={confirmLogout}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Yes
                            </button>
                            <button
                                onClick={cancelLogout}
                                className={`px-4 py-2 ${isDarkMode?'bg-white':'bg-black'} rounded `}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
    