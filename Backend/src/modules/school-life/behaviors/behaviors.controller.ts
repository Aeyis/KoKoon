import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { BehaviorsService } from './behaviors.service';
import { CreateBehaviorDto } from './dto/create-behavior.dto';
import { UpdateBehaviorDto } from './dto/update-behavior.dto';
import {JwtAuthGuard} from "../../auth/guards/jwt-auth-guard";
import {RolesGuards} from "../../auth/guards/roles.guards";
import {Roles} from "../../auth/decorators/roles.decorator";
import {UserRole} from "../../users/entities/user.entity";
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuards)
@Controller('behaviors')
export class BehaviorsController {
  constructor(private readonly behaviorsService: BehaviorsService) {}

  @Roles(UserRole.TEACHER)
  @Post()
  create(@Body() createBehaviorDto: CreateBehaviorDto) {
    return this.behaviorsService.create(createBehaviorDto);
  }

  @Get()
  findAll() {
    return this.behaviorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.behaviorsService.findOne(+id);
  }

  @Roles(UserRole.TEACHER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBehaviorDto: UpdateBehaviorDto) {
    return this.behaviorsService.update(+id, updateBehaviorDto);
  }

  @Roles(UserRole.TEACHER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.behaviorsService.remove(+id);
  }
}
