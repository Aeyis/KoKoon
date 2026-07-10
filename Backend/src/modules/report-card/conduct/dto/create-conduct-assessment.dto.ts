import { IsEnum, IsInt } from 'class-validator';
import { ConductLevel } from '../entities/conduct-assessment.entity';

export class CreateConductAssessmentDto {
  @IsInt()
  studentId: number;

  @IsInt()
  itemId: number;

  @IsInt()
  periodId: number;

  @IsEnum(ConductLevel)
  level: ConductLevel;
}
