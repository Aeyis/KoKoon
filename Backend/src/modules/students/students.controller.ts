import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {JwtAuthGuard} from "../auth/guards/jwt-auth-guard";
import {RolesGuards} from "../auth/guards/roles.guards";
import {UserRole} from "../users/entities/user.entity";
import {Roles} from "../auth/decorators/roles.decorator";


@UseGuards(JwtAuthGuard, RolesGuards)
@Controller('students')

export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}
  @Roles(UserRole.TEACHER)
  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }


}