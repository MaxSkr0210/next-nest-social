import { IUser } from './user.types';

export interface IAuthResponse {
    readonly accessToken: string;
    readonly refreshToken: string;
    user: IUser;
}
