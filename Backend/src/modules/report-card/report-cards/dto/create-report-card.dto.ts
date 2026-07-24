import { IsDateString, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ReportCardStatus } from '../entities/report-card.entity';

export class CreateReportCardDto {
    @IsOptional()
    @IsString()
    comment?: string;

    @IsOptional()
    @IsString()
    conductComment?: string;

    @IsOptional()
    @IsEnum(ReportCardStatus)
    status?: ReportCardStatus;
    @IsOptional()
    @IsString()
    signature?: string;

    @IsOptional()
    @IsDateString()
    dueDate?: string;

    @IsInt()
    studentId: number;

    @IsInt()
    periodId: number;
}