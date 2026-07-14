import {IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength} from "class-validator";
import {Sex} from "../entities/student.entity";

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

    @IsOptional()
    @IsInt()
    classId?: number;

    @IsOptional()
    @IsInt()
    schoolId?: number;

    @IsEnum(Sex)
    sex: Sex;
}