import {IsEmail, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateSchoolDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    postalCode: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsEmail()
    @IsOptional()
    email?: string;
}
