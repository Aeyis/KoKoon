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

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Post()
  async create(@Request() req, @Body() createStudentDto: CreateStudentDto) {
    await this.assertAccess(req.user, createStudentDto.classId);
    return this.studentsService.create(createStudentDto);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Get()
  async findAll(@Request() req) {
    const ids = await this.classAccess.accessibleClassIds(req.user);
    return this.studentsService.findAll(ids);
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

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Post(':id/guardians')
  addGuardian(@Param('id') id: string, @Body() dto: AddGuardianDto) {
    return this.studentsService.addGuardian(+id, dto.userId);
  }

  private async assertAccess(user: { id: number; role: UserRole }, classId: number | null | undefined) {
    if (!(await this.classAccess.canAccess(user, classId))) {
      throw new ForbiddenException('You do not have access to this class');
    }
  }
}