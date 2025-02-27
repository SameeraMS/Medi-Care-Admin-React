import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://medicare-57e8.onrender.com/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Always get the latest token
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const updateAxiosHeaders = (token) => {
    if (token) {
        localStorage.setItem('token', token); // Store token in localStorage
    } else {
        localStorage.removeItem('token'); // Remove token on logout
    }
};

export default axiosInstance;
