import { IUser } from '@/types';

export interface IAuthResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}
