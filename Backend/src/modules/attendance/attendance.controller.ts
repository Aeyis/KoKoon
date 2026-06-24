import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {AttendanceService} from './attendance.service';
import {CreateAttendanceDto} from './dto/create-attendance.dto';
import {UpdateAttendanceDto} from './dto/update-attendance.dto';
import {RolesGuards} from "../auth/guards/roles.guards";
import {JwtAuthGuard} from "../auth/guards/jwt-auth-guard";
import {Roles} from "../auth/decorators/roles.decorator";
import {UserRole} from "../users/entities/user.entity";

@UseGuards(JwtAuthGuard, RolesGuards)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Roles(UserRole.TEACHER)
  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(+id);
  }

  @Roles(UserRole.TEACHER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendanceService.update(+id, updateAttendanceDto);
  }

  @Roles(UserRole.TEACHER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(+id);
  }
}
