import axios from 'axios';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
console.log('>> deprecated: ', `axios instance: .env`);

if (process.env.NODE_ENV == 'production') {
    // Load .env.production to override any variables from .env
    dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });
    console.log('>> deprecated', `axios instance: load .env.production`, {
        NODE_ENV: process.env.NODE_ENV,
    });
}

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
        // console.log('Starting Request', config);
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
