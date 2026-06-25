import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReportCardsService } from './report-cards.service';
import { CreateReportCardDto } from './dto/create-report-card.dto';
import { UpdateReportCardDto } from './dto/update-report-card.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { RolesGuards } from '../../auth/guards/roles.guards';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuards)
@Controller('report-cards')
export class ReportCardsController {
  constructor(private readonly reportCardsService: ReportCardsService) {}

  @Roles(UserRole.TEACHER)
  @Post()
  create(@Body() createReportCardDto: CreateReportCardDto) {
    return this.reportCardsService.create(createReportCardDto);
  }

  @Get()
  findAll() {
    return this.reportCardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportCardsService.findOne(+id);
  }

  @Roles(UserRole.TEACHER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportCardDto: UpdateReportCardDto) {
    return this.reportCardsService.update(+id, updateReportCardDto);
  }

  @Roles(UserRole.TEACHER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportCardsService.remove(+id);
  }
}