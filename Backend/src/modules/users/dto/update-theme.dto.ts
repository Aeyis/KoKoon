import { IsEnum } from 'class-validator';
import { ThemeMode } from '../entities/user.entity';

export class UpdateThemeDto {
  @IsEnum(ThemeMode)
  theme: ThemeMode;
}