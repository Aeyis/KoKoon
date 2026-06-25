import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PeriodsService } from './periods.service';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { RolesGuards } from '../../auth/guards/roles.guards';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuards)
@Controller('periods')
export class PeriodsController {
  constructor(private readonly periodsService: PeriodsService) {}

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Post()
  create(@Body() createPeriodDto: CreatePeriodDto) {
    return this.periodsService.create(createPeriodDto);
  }

  @Get()
  findAll() { return this.periodsService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.periodsService.findOne(+id); }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePeriodDto: UpdatePeriodDto) {
    return this.periodsService.update(+id, updatePeriodDto);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Delete(':id')
  remove(@Param('id') id: string) { return this.periodsService.remove(+id); }
}