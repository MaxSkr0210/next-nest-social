import { HttpInstanceFactory } from '@/utils/HttpInstanceFactory';

export class UserApi {
    private static instance: UserApi | null = null;
    private httpInstance: Axios.AxiosInstance;
    private constructor() {
        this.httpInstance = HttpInstanceFactory.getBaseInstance();
    }

    public static getInstance(): UserApi {
        if (this.instance) return this.instance;
        this.instance = new UserApi();
        return this.instance;
    }
    public async getMe() {
        return (await this.httpInstance.get('/auth/me')).data;
    }
}
