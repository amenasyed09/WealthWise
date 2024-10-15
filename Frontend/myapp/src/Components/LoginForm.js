import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function LoginForm() {
    const navigate=useNavigate();
    const [data, setData] = useState({
        username: '',
        password: '',
    });
    const [err, setErr] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!data.username || !data.password) {
            setErr("Username and password are required");
            return;
        }

        setErr('');

        try {
            const response = await axios.post('http://localhost:5000/api/login', data, {
                withCredentials: true
            });

            setMessage(response.data.message);
            setData({ username: '', password: '' });
            navigate('/profile');

        } catch (err) {
            if (err.response) {
                setErr(err.response.data.message || "An error occurred");
            } else {
                setErr("Network error, please try again");
            }
            setMessage('');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/signup.jpg')", opacity: 0.8 }}>
            <div className="flex flex-col justify-center items-center p-6">
                <h1 className="text-6xl font-bold text-white mb-8">Wealth Wise</h1> {/* Added Title */}

                <div className="bg-black shadow-2xl p-10 rounded-lg w-full max-w-md border border-black bg-opacity-80">
                    <h2 className="text-4xl font-bold text-white text-center mb-6">Login</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-white text-2xl mb-1">Enter username:</label>
                            <input
                                type="text"
                                value={data.username}
                                name="username"
                                onChange={handleChange}
                                className="w-full p-2 rounded border text-black"
                                placeholder="Enter your username"
                            />
                        </div>
                        <div>
                            <label className="block text-white text-2xl mb-1">Enter password:</label>
                            <input
                                type="password"
                                value={data.password}
                                name="password"
                                onChange={handleChange}
                                className="w-full p-2 rounded border text-black"
                                placeholder="Enter your password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-black text-white font-bold p-3 rounded-lg hover:bg-blue-700"
                        >
                            Submit
                        </button>

                        {err && <p className="text-red-500 text-sm">{err}</p>}
                        {message && <p className="text-green-500 text-sm">{message}</p>}
                    </form>

                    <p className="text-white text-center mt-4">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-400 underline">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
