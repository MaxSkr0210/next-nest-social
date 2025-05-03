import { IUser } from '@/types/user.type';

export interface IAuthResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}
