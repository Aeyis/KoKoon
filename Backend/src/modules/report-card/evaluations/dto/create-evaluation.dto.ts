import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class CreateEvaluationDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    title: string;

    @IsNumber()
    @Min(0)
    score: number;

    @IsNumber()
    @Min(0)
    maxScore: number;

    @IsDateString()
    date: string;

    @IsInt()
    studentId: number;

    @IsInt()
    subjectId: number;

    @IsInt()
    periodId: number;
}