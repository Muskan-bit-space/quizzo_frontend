import axios from 'axios';

const axios_instance=axios.create(
    {
        baseURL:'http://localhost:4444',
        // baseURL:'https://quizzo-backend.vercel.app/',
        timeout:5000,
        // headers:
    }
);
export default axios_instance;