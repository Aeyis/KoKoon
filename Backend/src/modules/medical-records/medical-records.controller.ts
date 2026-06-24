import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {MedicalRecordsService} from './medical-records.service';
import {CreateMedicalRecordDto} from './dto/create-medical-record.dto';
import {UpdateMedicalRecordDto} from './dto/update-medical-record.dto';
import {JwtAuthGuard} from "../auth/guards/jwt-auth-guard";
import {RolesGuards} from "../auth/guards/roles.guards";
import {Roles} from "../auth/decorators/roles.decorator";
import {UserRole} from "../users/entities/user.entity";

@UseGuards(JwtAuthGuard, RolesGuards)
@Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  create(@Body() createMedicalRecordDto: CreateMedicalRecordDto) {
    return this.medicalRecordsService.create(createMedicalRecordDto);
  }

  @Get()
  findAll() {
    return this.medicalRecordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicalRecordsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedicalRecordDto: UpdateMedicalRecordDto) {
    return this.medicalRecordsService.update(+id, updateMedicalRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicalRecordsService.remove(+id);
  }
}
