import { IsEnum } from 'class-validator';
import { ConductLevel } from '../entities/conduct-assessment.entity';

export class UpdateConductAssessmentDto {
  @IsEnum(ConductLevel)
  level: ConductLevel;
}
