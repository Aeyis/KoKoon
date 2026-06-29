import { IsNotEmpty, IsString } from 'class-validator';

export class JoinSchoolDto {
    @IsString()
    @IsNotEmpty()
    code: string;
}
