import {IsDateString, IsEnum, IsInt, IsOptional, IsString, MaxLength} from "class-validator";
import {BehaviorType} from "../entities/behavior.entity";


export class CreateBehaviorDto {
    @IsEnum(BehaviorType)
    type: BehaviorType;

    @IsString()
    @MaxLength(155)
    reason: string;

    @IsOptional()
    @IsString()
    comment?: string;

    @IsDateString()
    date: string;

    @IsInt()
    studentId: number;
}
