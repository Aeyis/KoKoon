import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ClassJournalsService } from './class-journals.service';
import { CreateClassJournalDto } from './dto/create-class-journal.dto';
import { UpdateClassJournalDto } from './dto/update-class-journal.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { RolesGuards } from '../../auth/guards/roles.guards';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ClassAccessService } from '../../organization/class-access/class-access.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuards)
@Controller('class-journals')
export class ClassJournalsController {
  constructor(
      private readonly classJournalsService: ClassJournalsService,
      private readonly classAccess: ClassAccessService,
  ) {}

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Post()
  async create(@Request() req, @Body() createClassJournalDto: CreateClassJournalDto) {
    await this.assertAccess(req.user, createClassJournalDto.classId);
    return this.classJournalsService.create(createClassJournalDto);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Get()
  async findAll(@Request() req) {
    const ids = await this.classAccess.accessibleClassIds(req.user);
    return this.classJournalsService.findAll(ids);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const entry = await this.classJournalsService.findOne(+id);
    await this.assertAccess(req.user, entry.classe?.id);
    return entry;
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateClassJournalDto: UpdateClassJournalDto) {
    const entry = await this.classJournalsService.findOne(+id);
    await this.assertAccess(req.user, entry.classe?.id);
    return this.classJournalsService.update(+id, updateClassJournalDto);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const entry = await this.classJournalsService.findOne(+id);
    await this.assertAccess(req.user, entry.classe?.id);
    return this.classJournalsService.remove(+id);
  }

  private async assertAccess(user: { id: number; role: UserRole }, classId: number | null | undefined) {
    if (!(await this.classAccess.canAccess(user, classId))) {
      throw new ForbiddenException('You do not have access to this class');
    }
  }
}
