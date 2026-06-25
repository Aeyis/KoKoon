import {IsDateString, IsInt, IsNotEmpty, IsOptional, IsString} from "class-validator";

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
}
