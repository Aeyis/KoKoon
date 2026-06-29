import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Request, ForbiddenException} from '@nestjs/common';
import {AttendanceService} from './attendance.service';
import {CreateAttendanceDto} from './dto/create-attendance.dto';
import {UpdateAttendanceDto} from './dto/update-attendance.dto';
import {RolesGuards} from "../../auth/guards/roles.guards";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth-guard";
import {Roles} from "../../auth/decorators/roles.decorator";
import {UserRole} from "../../users/entities/user.entity";
import { ApiBearerAuth } from '@nestjs/swagger';
import { ClassAccessService } from '../../organization/class-access/class-access.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuards)
@Controller('attendance')
export class AttendanceController {
  constructor(
      private readonly attendanceService: AttendanceService,
      private readonly classAccess: ClassAccessService,
  ) {}

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Post()
  async create(@Request() req, @Body() createAttendanceDto: CreateAttendanceDto) {
    const classId = await this.attendanceService.studentClassId(createAttendanceDto.studentId);
    await this.assertAccess(req.user, classId);
    return this.attendanceService.create(createAttendanceDto);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Get()
  async findAll(@Request() req) {
    const ids = await this.classAccess.accessibleClassIds(req.user);
    return this.attendanceService.findAll(ids);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const att = await this.attendanceService.findOne(+id);
    await this.assertAccess(req.user, att.student?.classe?.id);
    return att;
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    const att = await this.attendanceService.findOne(+id);
    await this.assertAccess(req.user, att.student?.classe?.id);
    return this.attendanceService.update(+id, updateAttendanceDto);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const att = await this.attendanceService.findOne(+id);
    await this.assertAccess(req.user, att.student?.classe?.id);
    return this.attendanceService.remove(+id);
  }

  private async assertAccess(user: { id: number; role: UserRole }, classId: number | null | undefined) {
    if (!(await this.classAccess.canAccess(user, classId))) {
      throw new ForbiddenException('You do not have access to this class');
    }
  }
}