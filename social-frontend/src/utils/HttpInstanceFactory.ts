import Cookies from 'js-cookie';
import { COOKIE_REFRESH_TOKEN } from '@/constants/constatnts';
import axios from 'axios';
import AxiosInstance = Axios.AxiosInstance;

const backend_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export class HttpInstanceFactory {
    private static baseInstance: AxiosInstance | null = null;
    private static authorizedInstance: AxiosInstance | null = null;

    public static getBaseInstance(): AxiosInstance {
        if (this.baseInstance) return this.baseInstance;
        this.baseInstance = axios.create({
            withCredentials: true,
            baseURL: backend_url,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return this.baseInstance;
    }

    public static getAuthorizedInstance(): AxiosInstance {
        if (!this.authorizedInstance) {
            return this.updateAuthorizedInstance();
        }
        return this.authorizedInstance;
    }

    public static updateAuthorizedInstance() {
        this.authorizedInstance = axios.create({
            baseURL: backend_url,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.authorizedInstance.interceptors.request.use(config => {
            const token = Cookies.get(COOKIE_REFRESH_TOKEN);

            if (token) {
                config.headers!.Authorization = `Bearer ${token}`;
            } else {
                delete config.headers!.Authorization;
            }
            return config;
        });
        return this.authorizedInstance;
    }
}
