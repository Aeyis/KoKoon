import {IsInt, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateMedicalRecordDto {

    @IsOptional()
    @IsString()
    allergies?: string;

    @IsOptional()
    @IsString()
    diet?: string;

    @IsOptional()
    @IsString()
    medicalConditions?: string;

    @IsString()
    @IsNotEmpty()
    emergencyContact: string;

    @IsInt()
    studentId: number;
}
