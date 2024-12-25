import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { GoogleLogin } from 'react-google-login';
import Header from '../component/Header';
import axios from 'axios';
import { message } from 'antd';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [messageApi, contextHolder] = message.useMessage();
    const history = useNavigate();

    const validateField = (name, value) => {
        if (name === 'username' && !value) {
            setErrors(prevErrors => ({ ...prevErrors, username: 'Username is required' }));
        } else if (name === 'password' && !value) {
            setErrors(prevErrors => ({ ...prevErrors, password: 'Password is required' }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = {};
        if (!username) validationErrors.username = 'Username is required';
        if (!password) validationErrors.password = 'Password is required';
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {

            try {
                const response = await axios.post('http://localhost:9999/auth/login', {
                    username,
                    password
                });
                console.log('Login successful:', response.data);
                messageApi.open({
                    type: 'success',
                    content: response.data.message,
                });
                localStorage.setItem('token', response.data.accessToken);
                localStorage.setItem('userId', response.data.info._id);
                localStorage.setItem('vip', response.data.info.accountType);
                setTimeout(() => {
                    history('/');
                }, 1000)
            } catch (error) {
                console.error('Login failed:', error);
                messageApi.open({
                    type: 'error',
                    content: error.response.data.message,
                });

            }
        }
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

    const toggleShowPassword = () => {
        setShowPassword(prevShow => !prevShow);
    };

    // const handleLoginSuccess = (response) => {
    //     console.log('Login Success:', response.profileObj);
    // };

    // const handleLoginFailure = (response) => {
    //     console.log('Login Failed:', response);
    // };

    return (
        <div className="bg-gray-100 h-screen">
            {contextHolder}
            <Header />
            <div className="flex justify-center items-center mt-10">
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                    <div className="flex justify-center mb-6">
                        <img src="logo 2.png" alt="Logo" className="w-24 h-auto" />
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
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
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                />
                                <button
                                    type="button"
                                    onClick={toggleShowPassword}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M17.707 8.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 111.414-1.414L10 14.586l6.293-6.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            <path fillRule="evenodd" d="M10 4a1 1 0 011 1v1.586l-1.293-1.293a1 1 0 00-1.414 0L5 8.586V10a1 1 0 11-2 0V6a2 2 0 012-2h6a1 1 0 110 2H6.414l3.293-3.293a1 1 0 011.414 0L10 4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M17.707 8.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 111.414-1.414L10 14.586l6.293-6.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            <path fillRule="evenodd" d="M10 4a1 1 0 011 1v1.586l-1.293-1.293a1 1 0 00-1.414 0L5 8.586V10a1 1 0 11-2 0V6a2 2 0 012-2h6a1 1 0 110 2H6.414l3.293-3.293a1 1 0 011.414 0L10 4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <Link to="/forgot" className="text-blue-600 hover:text-blue-500">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                    <div className="mt-6 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or</span>
                        </div>
                    </div>
                    {/* <div className="mt-6">
                        <GoogleLogin
                            clientId="YOUR_GOOGLE_CLIENT_ID"
                            buttonText="Login with Google"
                            onSuccess={handleLoginSuccess}
                            onFailure={handleLoginFailure}
                            cookiePolicy={'single_host_origin'}
                            className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        />
                    </div> */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
