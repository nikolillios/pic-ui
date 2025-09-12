import axios from 'axios';
import API_CONFIG from '../config/api';

// Create axios instance with default configuration
const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.REQUEST_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token and logging
apiClient.interceptors.request.use(
    (config) => {
        // Add authentication token if available
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log requests in development
        if (API_CONFIG.IS_DEVELOPMENT) {
            console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors and logging
apiClient.interceptors.response.use(
    (response) => {
        // Log successful responses in development
        if (API_CONFIG.IS_DEVELOPMENT) {
            console.log(`API Response: ${response.status} ${response.config.url}`);
        }
        return response;
    },
    (error) => {
        // Handle common error scenarios
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;
            
            switch (status) {
                case 401:
                    // Unauthorized - redirect to login
                    localStorage.removeItem('access_token');
                    window.location.href = '/login';
                    break;
                case 403:
                    console.error('Forbidden: Insufficient permissions');
                    break;
                case 404:
                    console.error('Not Found: Resource does not exist');
                    break;
                case 500:
                    console.error('Server Error: Internal server error');
                    break;
                default:
                    console.error(`API Error: ${status} - ${data?.message || 'Unknown error'}`);
            }
        } else if (error.request) {
            // Network error
            console.error('Network Error: Unable to reach the server');
        } else {
            // Other error
            console.error('Request Error:', error.message);
        }

        return Promise.reject(error);
    }
);

// Retry logic for failed requests
const retryRequest = async (config, retryCount = 0) => {
    try {
        return await apiClient(config);
    } catch (error) {
        if (retryCount < API_CONFIG.REQUEST_CONFIG.RETRY_ATTEMPTS) {
            console.log(`Retrying request (${retryCount + 1}/${API_CONFIG.REQUEST_CONFIG.RETRY_ATTEMPTS})`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
            return retryRequest(config, retryCount + 1);
        }
        throw error;
    }
};

export { apiClient, retryRequest };
export default apiClient;
