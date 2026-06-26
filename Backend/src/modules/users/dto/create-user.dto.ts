import {IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";
import {UserRole} from "../entities/user.entity";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    lastName: string;



}
