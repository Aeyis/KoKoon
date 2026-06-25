import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { RolesGuards } from '../../auth/guards/roles.guards';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuards)
@Controller('evaluations')
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Roles(UserRole.TEACHER)
  @Post()
  create(@Body() createEvaluationDto: CreateEvaluationDto) {
    return this.evaluationsService.create(createEvaluationDto);
  }

  @Get()
  findAll() {
    return this.evaluationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evaluationsService.findOne(+id);
  }

  @Roles(UserRole.TEACHER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEvaluationDto: UpdateEvaluationDto) {
    return this.evaluationsService.update(+id, updateEvaluationDto);
  }

  @Roles(UserRole.TEACHER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.evaluationsService.remove(+id);
  }
}