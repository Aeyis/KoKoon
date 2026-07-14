import { IsInt, IsOptional } from 'class-validator';

export class AssignClassDto {
  // null / absent = retirer l'élève de sa classe (le remettre dans le vivier).
  @IsOptional()
  @IsInt()
  classId?: number | null;
}
