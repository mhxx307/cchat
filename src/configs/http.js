import axios from 'axios';

const productionLink = 'https://cong-nghe-moi-backend.onrender.com/api/v1';
const developmentLink = 'http://localhost:8000/api/v1';
const baseURL =
    process.env.NODE_ENV === 'production' ? productionLink : developmentLink;

class Http {
    instance;
    constructor() {
        this.instance = axios.create({
            baseURL: baseURL,
            timeout: 10000, // 10 seconds
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.instance.interceptors.response.use((response) => {
            return response.data;
        });
    }
}

const httpRequest = new Http().instance;

export default httpRequest;
