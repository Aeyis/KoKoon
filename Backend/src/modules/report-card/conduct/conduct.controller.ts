import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ConductService } from './conduct.service';
import { CreateConductAssessmentDto } from './dto/create-conduct-assessment.dto';
import { UpdateConductAssessmentDto } from './dto/update-conduct-assessment.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { RolesGuards } from '../../auth/guards/roles.guards';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ClassAccessService } from '../../organization/class-access/class-access.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuards)
@Controller('conduct')
export class ConductController {
  constructor(
    private readonly conductService: ConductService,
    private readonly classAccess: ClassAccessService,
  ) {}

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Get('items')
  findItems() {
    return this.conductService.findItems();
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Get('assessments')
  async findAssessments(@Request() req) {
    const ids = await this.classAccess.accessibleClassIds(req.user);
    return this.conductService.findAssessments(ids);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Post('assessments')
  async create(@Request() req, @Body() dto: CreateConductAssessmentDto) {
    const classId = await this.classAccess.studentClassId(dto.studentId);
    await this.assertAccess(req.user, classId);
    return this.conductService.create(dto);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Patch('assessments/:id')
  async update(@Request() req, @Param('id') id: string, @Body() dto: UpdateConductAssessmentDto) {
    const assessment = await this.conductService.findOne(+id);
    await this.assertAccess(req.user, assessment.student?.classe?.id);
    return this.conductService.update(+id, dto);
  }

  private async assertAccess(user: { id: number; role: UserRole }, classId: number | null | undefined) {
    if (!(await this.classAccess.canAccess(user, classId))) {
      throw new ForbiddenException('You do not have access to this class');
    }
  }
}
