import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ClassTeachersService } from './class-teachers.service';
import { CreateClassTeacherDto } from './dto/create-class-teacher.dto';
import { UpdateClassTeacherDto } from './dto/update-class-teacher.dto';
import { JwtAuthGuard } from "../../auth/guards/jwt-auth-guard";
import { RolesGuards } from "../../auth/guards/roles.guards";
import { Roles } from "../../auth/decorators/roles.decorator";
import { UserRole } from "../../users/entities/user.entity";

@UseGuards(JwtAuthGuard, RolesGuards)
@Controller('class-teachers')
export class ClassTeachersController {
  constructor(private readonly classTeachersService: ClassTeachersService) {}

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL)
  @Post()
  create(@Body() createClassTeacherDto: CreateClassTeacherDto) {
    return this.classTeachersService.create(createClassTeacherDto);
  }

  @Get()
  findAll() { return this.classTeachersService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.classTeachersService.findOne(+id); }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassTeacherDto: UpdateClassTeacherDto) {
    return this.classTeachersService.update(+id, updateClassTeacherDto);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL)
  @Delete(':id')
  remove(@Param('id') id: string) { return this.classTeachersService.remove(+id); }
}