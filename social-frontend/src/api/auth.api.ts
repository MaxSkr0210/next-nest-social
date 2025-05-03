import { HttpInstanceFactory } from '@/utils/HttpInstanceFactory';
import { IRegistrationInput } from '@/schemas/registration.schema';
import { IAuthResponse } from '@/types/auth.type';
import { ILoginInput } from '@/schemas/login.schema';

export class AuthApi {
    private static instance: AuthApi | null = null;
    private httpInstance: Axios.AxiosInstance;
    private constructor() {
        this.httpInstance = HttpInstanceFactory.getBaseInstance();
    }

    public static getInstance(): AuthApi {
        if (this.instance) return this.instance;
        this.instance = new AuthApi();
        return this.instance;
    }

    public async registration(data: IRegistrationInput) {
        return (await this.httpInstance.post<IAuthResponse>('/auth/register', data)).data;
    }

    public async login(data: ILoginInput) {
        return (await this.httpInstance.post<IAuthResponse>('/auth/login', data)).data;
    }

    public async logout() {
        return (await this.httpInstance.post('/auth/logout')).data;
    }

    public async refresh(refreshToken: string) {
        return (
            await this.httpInstance.post('/auth/refresh', {
                refreshToken,
            })
        ).data;
    }
}
