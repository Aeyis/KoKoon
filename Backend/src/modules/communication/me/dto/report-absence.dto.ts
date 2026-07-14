import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export enum AbsenceScope {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  FULL_DAY = 'FULL_DAY',
}

export class ReportAbsenceDto {
  @IsDateString()
  date: string;

  @IsEnum(AbsenceScope)
  scope: AbsenceScope;

  @IsOptional()
  @IsString()
  reason?: string;
}
