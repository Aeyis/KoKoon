import {Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards, Request, ForbiddenException} from '@nestjs/common';
import {ClassesService} from './classes.service';
import {CreateClassDto} from './dto/create-class.dto';
import {UpdateClassDto} from './dto/update-class.dto';
import {UpdateSeatingDto} from './dto/update-seating.dto';
import {Roles} from "../../auth/decorators/roles.decorator";
import {UserRole} from "../../users/entities/user.entity";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth-guard";
import {RolesGuards} from "../../auth/guards/roles.guards";
import { ApiBearerAuth } from '@nestjs/swagger';
import { ClassAccessService } from '../class-access/class-access.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuards)
@Controller('classes')
export class ClassesController {
  constructor(
      private readonly classesService: ClassesService,
      private readonly classAccess: ClassAccessService,
  ) {}

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL)
  @Post()
  async create(@Request() req, @Body() createClassDto: CreateClassDto) {
    const ids = await this.classAccess.accessibleSchoolIds(req.user);
    if (ids !== null && (!createClassDto.schoolId || !ids.includes(createClassDto.schoolId))) {
      throw new ForbiddenException('You cannot create a class in this school');
    }
    return this.classesService.create(createClassDto);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Get()
  async findAll(@Request() req) {
    const ids = await this.classAccess.accessibleClassIds(req.user);
    return this.classesService.findAll(ids);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    await this.assertAccess(req.user, +id);
    return this.classesService.findOne(+id);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    await this.assertAccess(req.user, +id);
    return this.classesService.update(+id, updateClassDto);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classesService.remove(+id);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Get(':id/seating')
  async getSeating(@Request() req, @Param('id') id: string) {
    await this.assertAccess(req.user, +id);
    return this.classesService.getSeating(+id);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Put(':id/seating')
  async setSeating(@Request() req, @Param('id') id: string, @Body() dto: UpdateSeatingDto) {
    await this.assertAccess(req.user, +id);
    return this.classesService.setSeating(+id, dto);
  }

  private async assertAccess(user: { id: number; role: UserRole }, classId: number) {
    if (!(await this.classAccess.canAccess(user, classId))) {
      throw new ForbiddenException('You do not have access to this class');
    }
  }
}