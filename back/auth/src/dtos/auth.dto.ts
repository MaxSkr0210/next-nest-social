export class AuthRegistrationDTO {
    id: number;
    username: string;
    password: string;
    email: string;
}

export class AuthLoginDTO {
    id: number;
    email: string;
    password: string;
}
