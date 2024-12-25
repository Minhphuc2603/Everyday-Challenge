import { Link } from "react-router-dom";
import Header from "../component/Header";
import { useState } from "react";
import axios from "axios";
import { message } from "antd";

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullname] = useState('');
    const [errors, setErrors] = useState({});
    const [messageApi, contextHolder] = message.useMessage();
    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(false);


    const validate = () => {
        const errors = {};

        if (!email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';
        }

        if (!fullName) {
            errors.fullName = 'Fullname is required';
        }

        if (!username) {
            errors.username = 'Username is required';
        }

        if (!password) {
            errors.password = 'Password is required';
        }

        if (!confirmPassword) {
            errors.confirmPassword = 'Confirm Password is required';
        } else if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        return errors;
    };

    const validateField = (name, value) => {
        let error = '';

        if (name === 'email') {
            if (!value) {
                error = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                error = 'Email is invalid';
            }
        }

        if (name === 'fullname' && !value) {
            error = 'Fullname is required';
        }

        if (name === 'username' && !value) {
            error = 'Username is required';
        }

        if (name === 'password' && !value) {
            error = 'Password is required';
        }

        if (name === 'confirmPassword') {
            if (!value) {
                error = 'Confirm Password is required';
            } else if (value !== password) {
                error = 'Passwords do not match';
            }
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
        }));
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        validateField('email', value);
    };

    const handleFullnameChange = (e) => {
        const value = e.target.value;
        setFullname(value);
        validateField('fullName', value);
    };

    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        validateField('username', value);
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        validateField('password', value);
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        validateField('confirmPassword', value);
    };

    const handleSubmit = async (e) => {

        setLoading(true);
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            const response = await axios.post('http://localhost:9999/auth/register', {
                email,
                fullName,
                username,
                password
            })
            messageApi.open({
                type: 'success',
                content: response.data.message,
            });
        } catch (error) {
            setErr(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-amber-50 h-screen">
            <Header />
            {contextHolder}
            <div className="flex justify-center items-center mt-10">
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                    <div className="flex justify-center">
                        <img src="logo 2.png" alt="Logo" className="w-24 h-auto ml-10 justify-center"></img>
                    </div>
                    {err && <p className="text-red-500 text-xl p-2 text-center mt-1">{err}</p>}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <span className="block text-sm font-medium text-gray-700">Email</span>
                            <input
                                type="text"
                                id="email"
                                value={email}
                                onChange={handleEmailChange}
                                className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <span className="block text-sm font-medium text-gray-700">Fullname</span>
                            <input
                                type="text"
                                id="fullname"
                                value={fullName}
                                onChange={handleFullnameChange}
                                className={`mt-1 block w-full px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            />
                            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                        </div>
                        <div>
                            <span className="block text-sm font-medium text-gray-700">Username</span>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={handleUsernameChange}
                                className={`mt-1 block w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            />
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                        </div>
                        <div>
                            <span className="block text-sm font-medium text-gray-700">Password</span>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={handlePasswordChange}
                                className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <span className="block text-sm font-medium text-gray-700">Confirm Password</span>
                            <input
                                type="password"
                                id="confirmpassword"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>

                        <div className="flex justify-center">
                            <button
                                disabled={loading}
                                type="submit"
                                className={`flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <svg
                                            className="animate-spin h-5 w-5 mr-3 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        <span>Loading...</span>
                                    </div>
                                ) : (
                                    'Đăng kí'
                                )}
                            </button>
                        </div>

                    </form>

                    <div className="mt-6 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            You have an account?{' '}
                            <Link to={"/login"} className="text-blue-600 hover:text-blue-500">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
