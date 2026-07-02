import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { JournalCategory } from '../entities/class-journal.entity';

export class CreateClassJournalDto {
  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  homework?: string;

  @IsOptional()
  @IsString()
  preparation?: string;

  @IsInt()
  classId: number;

  @IsOptional()
  @IsInt()
  subjectId?: number;

  @IsOptional()
  @IsBoolean()
  done?: boolean;

  @IsOptional()
  @IsEnum(JournalCategory)
  category?: JournalCategory;
}
