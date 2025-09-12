// API Configuration
// This file centralizes all API-related configuration

const API_CONFIG = {
    // Get API URL from environment variable, fallback to localhost for development
    BASE_URL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/',
    
    // Environment detection
    IS_DEVELOPMENT: import.meta.env.VITE_APP_ENV === 'development' || import.meta.env.DEV,
    IS_PRODUCTION: import.meta.env.VITE_APP_ENV === 'production' || import.meta.env.PROD,
    
    // API Endpoints
    ENDPOINTS: {
        IMAGES: {
            GET_BY_USER: 'images/getImagesByUser',
            GET_COLLECTIONS: 'images/getCollections',
            UPLOAD_TO_COLLECTION: 'images/uploadImageToCollection/',
            CREATE_COLLECTION: 'images/createCollection',
            DELETE_IMAGE: 'images/deleteImage/',
            GET_DEVICE_CONFIGS: 'images/getDeviceConfigs',
            UPDATE_DEVICE_CONFIG: 'images/updateDeviceConfig/',
        }
    },
    
    // Request configuration
    REQUEST_CONFIG: {
        TIMEOUT: 10000, // 10 seconds
        RETRY_ATTEMPTS: 3,
    }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get full endpoint URLs
export const getApiEndpoint = (category, endpoint) => {
    const fullEndpoint = API_CONFIG.ENDPOINTS[category]?.[endpoint];
    if (!fullEndpoint) {
        throw new Error(`API endpoint not found: ${category}.${endpoint}`);
    }
    return buildApiUrl(fullEndpoint);
};

export default API_CONFIG;
