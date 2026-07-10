import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateEvaluationDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(150)
    competency?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    score?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    maxScore?: number;

    @IsOptional()
    @IsString()
    @MaxLength(5)
    grade?: string;

    @IsDateString()
    date: string;

    @IsInt()
    studentId: number;

    @IsInt()
    subjectId: number;

    @IsInt()
    periodId: number;
}