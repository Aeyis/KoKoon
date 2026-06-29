import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { RolesGuards } from '../../auth/guards/roles.guards';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ClassAccessService } from '../../organization/class-access/class-access.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuards)
@Controller('evaluations')
export class EvaluationsController {
  constructor(
      private readonly evaluationsService: EvaluationsService,
      private readonly classAccess: ClassAccessService,
  ) {}

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Post()
  async create(@Request() req, @Body() createEvaluationDto: CreateEvaluationDto) {
    const classId = await this.classAccess.studentClassId(createEvaluationDto.studentId);
    await this.assertAccess(req.user, classId);
    return this.evaluationsService.create(createEvaluationDto);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Get()
  async findAll(@Request() req) {
    const ids = await this.classAccess.accessibleClassIds(req.user);
    return this.evaluationsService.findAll(ids);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const evaluation = await this.evaluationsService.findOne(+id);
    await this.assertAccess(req.user, evaluation.student?.classe?.id);
    return evaluation;
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateEvaluationDto: UpdateEvaluationDto) {
    const evaluation = await this.evaluationsService.findOne(+id);
    await this.assertAccess(req.user, evaluation.student?.classe?.id);
    return this.evaluationsService.update(+id, updateEvaluationDto);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const evaluation = await this.evaluationsService.findOne(+id);
    await this.assertAccess(req.user, evaluation.student?.classe?.id);
    return this.evaluationsService.remove(+id);
  }

  private async assertAccess(user: { id: number; role: UserRole }, classId: number | null | undefined) {
    if (!(await this.classAccess.canAccess(user, classId))) {
      throw new ForbiddenException('You do not have access to this class');
    }
  }
}
