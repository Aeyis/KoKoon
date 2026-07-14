import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {JwtAuthGuard} from "../auth/guards/jwt-auth-guard";
import {RolesGuards} from "../auth/guards/roles.guards";
import {UserRole} from "../users/entities/user.entity";
import {Roles} from "../auth/decorators/roles.decorator";
import {AddGuardianDto} from "./dto/add-guardian.dto";
import {InviteGuardianDto} from "./dto/invite-guardian.dto";
import {AssignClassDto} from "./dto/assign-class.dto";
import { ApiBearerAuth } from '@nestjs/swagger';
import { ClassAccessService } from '../organization/class-access/class-access.service';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuards)
@Controller('students')
export class StudentsController {
  constructor(
      private readonly studentsService: StudentsService,
      private readonly classAccess: ClassAccessService,
  ) {}

  // Seuls la direction et l'admin créent des élèves dans la base.
  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL)
  @Post()
  async create(@Request() req, @Body() createStudentDto: CreateStudentDto) {
    await this.assertSchool(req.user, createStudentDto.schoolId);
    if (createStudentDto.classId) await this.assertAccess(req.user, createStudentDto.classId);
    return this.studentsService.create(createStudentDto);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Get()
  async findAll(@Request() req) {
    const ids = await this.classAccess.accessibleClassIds(req.user);
    return this.studentsService.findAll(ids);
  }

  // Vivier d'élèves de mes écoles non encore affectés à une classe.
  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Get('available')
  async available(@Request() req) {
    const schoolIds = await this.classAccess.accessibleSchoolIds(req.user);
    return this.studentsService.findAvailable(schoolIds);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const student = await this.studentsService.findOne(+id);
    await this.assertAccess(req.user, student.classe?.id);
    return student;
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    const student = await this.studentsService.findOne(+id);
    await this.assertAccess(req.user, student.classe?.id);
    return this.studentsService.update(+id, updateStudentDto);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }

  // Le prof affecte un élève (de son école) à une classe qu'il gère, ou l'en retire.
  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Patch(':id/assign')
  async assign(@Request() req, @Param('id') id: string, @Body() dto: AssignClassDto) {
    const student = await this.studentsService.findOne(+id);
    await this.assertSchool(req.user, student.school?.id);
    if (dto.classId) await this.assertAccess(req.user, dto.classId);
    return this.studentsService.assignClass(+id, dto.classId ?? null);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Post(':id/guardians')
  addGuardian(@Param('id') id: string, @Body() dto: AddGuardianDto) {
    return this.studentsService.addGuardian(+id, dto.userId);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Post(':id/invite-guardian')
  async inviteGuardian(@Request() req, @Param('id') id: string, @Body() dto: InviteGuardianDto) {
    const student = await this.studentsService.findOne(+id);
    await this.assertAccess(req.user, student.classe?.id);
    return this.studentsService.inviteGuardian(+id, dto);
  }

  private async assertAccess(user: { id: number; role: UserRole }, classId: number | null | undefined) {
    if (!(await this.classAccess.canAccess(user, classId))) {
      throw new ForbiddenException('You do not have access to this class');
    }
  }

  private async assertSchool(user: { id: number; role: UserRole }, schoolId: number | null | undefined) {
    const ids = await this.classAccess.accessibleSchoolIds(user);
    if (ids === null) return; // admin : toutes les écoles
    if (!schoolId || !ids.includes(schoolId)) {
      throw new ForbiddenException('You cannot manage students in this school');
    }
  }
}