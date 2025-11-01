import axios from 'axios';

// dotenv.config();

export const axios_instance = axios.create({
    baseURL: process.env.API_BASE_URL || 'http://localhost:4000',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axios_instance.interceptors.request.use(
    (config) => {
        // console.log(config)
        // e.g. Add token
        // const token = localStorage.getItem("token");
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

axios_instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('Axios Error:', error);
        return Promise.reject(error);
    }
);

export default axios_instance;
