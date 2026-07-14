import { IsOptional, IsString } from 'class-validator';

export class UpdateChildMedicalDto {
  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  diet?: string;

  @IsOptional()
  @IsString()
  medicalConditions?: string;

  @IsOptional()
  @IsString()
  emergencyContact?: string;
}
