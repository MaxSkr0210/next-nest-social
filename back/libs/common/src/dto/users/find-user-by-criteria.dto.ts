import { IsEmail, IsString, MinLength } from "class-validator";

export class FindUserByCriteriaDto {
    @IsString()
    @MinLength(6)
    username: string;

    @IsEmail()
    email: string;
}
