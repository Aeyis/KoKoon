import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards, Request } from '@nestjs/common';
import { MeService } from './me.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { RolesGuards } from '../../auth/guards/roles.guards';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateChildMedicalDto } from './dto/update-child-medical.dto';
import { ReportAbsenceDto } from './dto/report-absence.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuards)
@Roles(UserRole.RESPONSABLE)
@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get('children')
  getChildren(@Request() req) {
    return this.meService.getChildren(req.user.id);
  }

  @Get('notifications')
  getNotifications(@Request() req) {
    return this.meService.getNotifications(req.user.id);
  }

  @Get('children/:childId/attendance')
  getChildAttendance(@Request() req, @Param('childId') childId: string) {
    return this.meService.getChildAttendance(req.user.id, +childId);
  }

  @Get('children/:childId/journal')
  getChildJournal(@Request() req, @Param('childId') childId: string) {
    return this.meService.getChildJournal(req.user.id, +childId);
  }

  @Get('children/:childId/evaluations')
  getChildEvaluations(@Request() req, @Param('childId') childId: string) {
    return this.meService.getChildEvaluations(req.user.id, +childId);
  }

  @Get('children/:childId/conduct')
  getChildConduct(@Request() req, @Param('childId') childId: string) {
    return this.meService.getChildConduct(req.user.id, +childId);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.meService.getProfile(req.user.id);
  }

  @Patch('profile')
  updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.meService.updateProfile(req.user.id, dto);
  }

  @Get('children/:childId/medical')
  getChildMedical(@Request() req, @Param('childId') childId: string) {
    return this.meService.getChildMedical(req.user.id, +childId);
  }

  @Put('children/:childId/medical')
  updateChildMedical(
    @Request() req,
    @Param('childId') childId: string,
    @Body() dto: UpdateChildMedicalDto,
  ) {
    return this.meService.updateChildMedical(req.user.id, +childId, dto);
  }

  @Get('children/:childId/events')
  getChildEvents(@Request() req, @Param('childId') childId: string) {
    return this.meService.getChildEvents(req.user.id, +childId);
  }

  @Post('children/:childId/absences')
  reportAbsence(
    @Request() req,
    @Param('childId') childId: string,
    @Body() dto: ReportAbsenceDto,
  ) {
    return this.meService.reportAbsence(req.user.id, +childId, dto);
  }
}