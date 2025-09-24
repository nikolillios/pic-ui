import { jwtDecode }  from 'jwt-decode'
import { useState } from "react";
import apiClient from "../services/apiClient";
import { getApiEndpoint } from "../config/api";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const submit = async e => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        try {
            const loginCredentials = {
                username: username,
                password: password
            };
            const {data} = await apiClient.post(
                getApiEndpoint('AUTH', 'LOGIN'),
                loginCredentials);
            localStorage.clear();
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            const tokenObj = jwtDecode(data.access)
            localStorage.setItem('uid', tokenObj['user_id'])
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`;
            window.location.href = '/'
        } catch (error) {
            setError("Invalid username or password. Please try again.");
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 z-50">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">Picturesque</h1>
                    <h2 className="text-2xl text-gray-300">Sign in to your account</h2>
                </div>
                
                <div className="bg-black border border-gray-700 rounded-lg shadow-xl p-8">
                    <form className="space-y-6" onSubmit={submit}>
                        {error && (
                            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}
                        
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Enter your username"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Enter your password"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
                                isLoading 
                                    ? 'bg-gray-600 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>
                </div>
                
                <div className="text-center">
                    <p className="text-sm text-gray-400">
                        Welcome to Picturesque - Your digital photo collection manager
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login