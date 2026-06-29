import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ReportCardsService } from './report-cards.service';
import { CreateReportCardDto } from './dto/create-report-card.dto';
import { UpdateReportCardDto } from './dto/update-report-card.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { RolesGuards } from '../../auth/guards/roles.guards';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ClassAccessService } from '../../organization/class-access/class-access.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuards)
@Controller('report-cards')
export class ReportCardsController {
  constructor(
      private readonly reportCardsService: ReportCardsService,
      private readonly classAccess: ClassAccessService,
  ) {}

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Post()
  async create(@Request() req, @Body() createReportCardDto: CreateReportCardDto) {
    const classId = await this.classAccess.studentClassId(createReportCardDto.studentId);
    await this.assertAccess(req.user, classId);
    return this.reportCardsService.create(createReportCardDto);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Get()
  async findAll(@Request() req) {
    const ids = await this.classAccess.accessibleClassIds(req.user);
    return this.reportCardsService.findAll(ids);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const reportCard = await this.reportCardsService.findOne(+id);
    await this.assertAccess(req.user, reportCard.student?.classe?.id);
    return reportCard;
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateReportCardDto: UpdateReportCardDto) {
    const reportCard = await this.reportCardsService.findOne(+id);
    await this.assertAccess(req.user, reportCard.student?.classe?.id);
    return this.reportCardsService.update(+id, updateReportCardDto);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const reportCard = await this.reportCardsService.findOne(+id);
    await this.assertAccess(req.user, reportCard.student?.classe?.id);
    return this.reportCardsService.remove(+id);
  }

  private async assertAccess(user: { id: number; role: UserRole }, classId: number | null | undefined) {
    if (!(await this.classAccess.canAccess(user, classId))) {
      throw new ForbiddenException('You do not have access to this class');
    }
  }
}
