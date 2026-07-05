import { IsArray, IsInt, Min } from 'class-validator';

export class UpdateSeatingDto {
  @IsInt()
  @Min(1)
  rows: number;

  @IsInt()
  @Min(1)
  cols: number;

  @IsArray()
  desks: any[];
}