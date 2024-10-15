import { useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import Cookies from 'js-cookie';

export default function Auth() {
    const [isSignup, setSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmpass: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token');
        const googleToken = Cookies.get('googletoken');

        if (token || googleToken) {
            navigate('/home'); // Navigate to home if token exists
        }
    }, [navigate]);

    const handleShowPassword = () => setShowPassword(prev => !prev);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSignup) {
            // Handle signup logic here
            try {
                const { username, email, password, confirmpass } = formData;

                // Ensure the passwords match
                if (password !== confirmpass) {
                    alert("Passwords do not match!");
                    return;
                }

                const response = await axios.post('http://localhost:5000/api/signup', {
                    username,
                    email,
                    password,
                    confirmPassword: confirmpass,
                }, { withCredentials: true });

                console.log('Signup successful:', response.data);
                Cookies.set('token', response.data.token); // Set token cookie
                navigate('/home'); // Automatically navigate to home after signup

            } catch (error) {
                console.error('Error during signup:', error.response.data);
            }
        } else {
            // Handle sign-in logic here
            try {
                const { email, password } = formData;

                const response = await axios.post('http://localhost:5000/api/signin', {
                    email,
                    password,
                }, { withCredentials: true });

                console.log('Signin successful:', response.data);
                Cookies.set('token', response.data.token); // Set token cookie
                navigate('/home'); // Automatically navigate to home after signin

            } catch (error) {
                console.error('Error during sign-in:', error.response.data);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSuccess = async (res) => {
        console.log(res);
        Cookies.set('googletoken', res.credential);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/google-login', {
                token: res.credential,
            }, { withCredentials: true }); // Include credentials if needed

            console.log(response.data); // Handle success response
            navigate('/home'); // Automatically navigate to home after Google login

        } catch (err) {
            console.log('Error logging in', err);
        }
    };

    const handleError = (err) => {
        console.log('Google login failure', err);
    };

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <div className="relative flex items-center justify-center min-h-screen bg-black bg-cover" style={{ backgroundImage: "url('images/img1.jpg')" }}>
                <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h1 className="text-2xl font-bold text-center mb-4">{isSignup ? 'Signup' : 'Sign in'}</h1>
                    <form onSubmit={handleSubmit}>
                        {isSignup && (
                            <>
                                <input
                                    name="username"
                                    placeholder="User name"
                                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                                    onChange={handleChange}
                                />
                            </>
                        )}
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="w-full p-2 mb-2 border border-gray-300 rounded"
                            onChange={handleChange}
                        />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            className="w-full p-2 mb-2 border border-gray-300 rounded"
                            onChange={handleChange}
                        />
                        <button type="button" onClick={handleShowPassword} className="text-blue-600 hover:underline mb-2">
                            {showPassword ? 'Hide Password' : 'Show Password'}
                        </button>
                        {isSignup && (
                            <input
                                type="password"
                                name="confirmpass"
                                placeholder="Confirm Password"
                                className="w-full p-2 mb-4 border border-gray-300 rounded"
                                onChange={handleChange}
                            />
                        )}
                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={handleError}
                            render={(renderProps) => (
                                <button
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}
                                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                                >
                                    Custom Google Login
                                </button>
                            )}
                        />
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition mt-4"
                        >
                            {isSignup ? 'Signup' : 'Sign in'}
                        </button>
                    </form>
                    <p className="mt-4 text-center">
                        {isSignup ? 'Already have an account?' : 'Create a new account'}{' '}
                        <a onClick={() => setSignup(prev => !prev)} className="text-blue-600 hover:underline cursor-pointer">
                            {isSignup ? 'Sign in' : 'Sign up'}
                        </a>
                    </p>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}
