import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {SchoolsService} from './schools.service';
import {CreateSchoolDto} from './dto/create-school.dto';
import {UpdateSchoolDto} from './dto/update-school.dto';
import {JwtAuthGuard} from "../../auth/guards/jwt-auth-guard";
import {RolesGuards} from "../../auth/guards/roles.guards";
import {Roles} from "../../auth/decorators/roles.decorator";
import {UserRole} from "../../users/entities/user.entity";
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuards)
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolsService.create(createSchoolDto);
  }

  @Get()
  findAll() {
    return this.schoolsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schoolsService.findOne(+id);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto) {
    return this.schoolsService.update(+id, updateSchoolDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schoolsService.remove(+id);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL)
  @Post(':id/staff/:userId')
  addStaff(@Param('id') id: string, @Param('userId') userId: string) {
    return this.schoolsService.addStaff(+id, +userId);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL)
  @Delete(':id/staff/:userId')
  removeStaff(@Param('id') id: string, @Param('userId') userId: string) {
    return this.schoolsService.removeStaff(+id, +userId);
  }
}