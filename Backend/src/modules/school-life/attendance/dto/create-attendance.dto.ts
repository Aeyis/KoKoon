import {IsDateString, IsEnum, IsInt, IsOptional, IsString} from "class-validator";
import {AttendanceSession, AttendanceStatus} from "../entities/attendance.entity";

export class CreateAttendanceDto {
    @IsDateString() date: string;
    @IsEnum(AttendanceSession) session: AttendanceSession;
    @IsEnum(AttendanceStatus) status: AttendanceStatus;
    @IsOptional()@IsString() justification?: string;
    @IsInt() studentId: number;
}
