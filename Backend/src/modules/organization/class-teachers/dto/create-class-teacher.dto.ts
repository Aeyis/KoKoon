import {IsEnum, IsInt, IsNotEmpty} from "class-validator";
import {ClassRole} from "../entities/class-teacher.entity";

export class CreateClassTeacherDto {
    @IsInt()
    @IsNotEmpty()
    teacherId: number;

    @IsInt()
    @IsNotEmpty()
    classeId: number;

    @IsEnum(ClassRole)
    @IsNotEmpty()
    role: ClassRole;
}