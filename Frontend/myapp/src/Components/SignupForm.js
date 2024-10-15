import React, { useState } from 'react';
import axios from 'axios';
import { Fade } from 'react-awesome-reveal';
import { Link } from 'react-router-dom'; // Import Link for routing
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
 const navigate=useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/signup', formData,
        {
          withCredentials:true
        }
      );
      setMessage(response.data);
      navigate('/profile')
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setMessage('Error during signup: ' + error.response?.data.message || error.message);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/signup.jpg')", opacity: 0.8 }}>
      <div className="flex flex-row justify-center items-center p-6">
        <div className="bg-black shadow-2xl p-10 rounded-lg w-full max-w-md border border-black bg-opacity-80 mr-6">
          <h2 className="text-4xl font-bold text-white text-center mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white text-2xl mb-1">Username:</label>
              <input
                type="text"
                name="username"
                className="w-full p-2 rounded border text-black"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}
            </div>

            <div>
              <label className="block text-white text-2xl mb-1">Email:</label>
              <input
                type="email"
                name="email"
                className="w-full p-2 rounded border text-black"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
            </div>

            <div>
              <label className="block text-white text-2xl mb-1">Password:</label>
              <input
                type="password"
                name="password"
                className="w-full p-2 rounded border text-black"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
            </div>

            <div>
              <label className="block text-white text-2xl mb-1">Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full p-2 rounded border text-black"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">{errors.confirmPassword}</span>
              )}
            </div>

            <div>
              <label className="block text-white text-2xl mb-1">Phone Number:</label>
              <input
                type="text"
                name="phone"
                className="w-full p-2 rounded border text-black"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white font-bold p-3 rounded-lg hover:bg-blue-700"
            >
              Sign Up
            </button>
          </form>

          {message && <p className="text-green-500 text-center mt-4">{message}</p>}

          {/* Login Link Section */}
          <div className="text-center mt-4">
            <p className="text-white text-lg">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Cards Section */}
        <div className="flex flex-col space-y-6 w-full max-w-md">
          <Fade delay={200} duration={600} direction='up'>
            <div className="bg-black p-4 rounded-lg shadow-lg">
              <h3 className="text-white text-2xl">Welcome to WealthWise</h3>
              <p className="text-white">Manage your finances effectively.</p>
            </div>
          </Fade>

          <Fade delay={400} duration={600} direction='up'>
            <div className="bg-black p-4 rounded-lg shadow-lg">
              <h3 className="text-white text-xl">Track Your Expenses</h3>
              <p className="text-white">Keep an eye on your spending habits.</p>
            </div>
          </Fade>

          <Fade delay={600} duration={600} direction='up'>
            <div className="bg-black p-4 rounded-lg shadow-lg">
              <h3 className="text-white text-xl">Track Your Income</h3>
              <p className="text-white">Know where your money is coming from.</p>
            </div>
          </Fade>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
