import {IsInt, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateClassDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    schoolYear: string;

    @IsOptional()
    @IsInt()
    teacherId: number;
}
