import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSubstitutionDto {
    @IsInt()
    @IsNotEmpty()
    substituteId: number;

    @IsInt()
    @IsNotEmpty()
    classeId: number;

    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsNotEmpty()
    endDate: string;
}