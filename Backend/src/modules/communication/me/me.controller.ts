import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { MeService } from './me.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { RolesGuards } from '../../auth/guards/roles.guards';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

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
}