import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ClassJournalsService } from './class-journals.service';
import { CreateClassJournalDto } from './dto/create-class-journal.dto';
import { UpdateClassJournalDto } from './dto/update-class-journal.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { RolesGuards } from '../../auth/guards/roles.guards';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuards)
@Controller('class-journals')
export class ClassJournalsController {
  constructor(private readonly classJournalsService: ClassJournalsService) {}

  @Roles(UserRole.TEACHER)
  @Post()
  create(@Body() createClassJournalDto: CreateClassJournalDto) {
    return this.classJournalsService.create(createClassJournalDto);
  }

  @Get()
  findAll() {
    return this.classJournalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classJournalsService.findOne(+id);
  }

  @Roles(UserRole.TEACHER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassJournalDto: UpdateClassJournalDto) {
    return this.classJournalsService.update(+id, updateClassJournalDto);
  }

  @Roles(UserRole.TEACHER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classJournalsService.remove(+id);
  }
}