import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SubstitutionsService } from './substitutions.service';
import { CreateSubstitutionDto } from './dto/create-substitution.dto';
import { UpdateSubstitutionDto } from './dto/update-substitution.dto';
import { JwtAuthGuard } from "../../auth/guards/jwt-auth-guard";
import { RolesGuards } from "../../auth/guards/roles.guards";
import { Roles } from "../../auth/decorators/roles.decorator";
import { UserRole } from "../../users/entities/user.entity";

@UseGuards(JwtAuthGuard, RolesGuards)
@Controller('substitutions')
export class SubstitutionsController {
  constructor(private readonly substitutionsService: SubstitutionsService) {}

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL)
  @Post()
  create(@Body() createSubstitutionDto: CreateSubstitutionDto) {
    return this.substitutionsService.create(createSubstitutionDto);
  }

  @Get()
  findAll() { return this.substitutionsService.findAll(); }

  @Get('active/:classeId')
  findActiveForClass(@Param('classeId') classeId: string) {
    return this.substitutionsService.findActiveForClass(+classeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.substitutionsService.findOne(+id); }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubstitutionDto: UpdateSubstitutionDto) {
    return this.substitutionsService.update(+id, updateSubstitutionDto);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL)
  @Delete(':id')
  remove(@Param('id') id: string) { return this.substitutionsService.remove(+id); }
}