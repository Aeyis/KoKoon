import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class InviteGuardianDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  lastName: string;
}
