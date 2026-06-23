import {IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength} from "class-validator";

export class CreateStudentDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(255)
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(255)
    lastName: string;

    @IsDateString()
    birthDate: string;

    @IsOptional()
    @IsString()
    photo?: string;
}