import { User } from "@/generated/prisma";

export interface IAuthResponse {
    readonly accessToken: string;
    readonly refreshToken: string;
    user: User;
}
