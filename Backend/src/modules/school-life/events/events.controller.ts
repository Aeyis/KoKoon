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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { RolesGuards } from '../../auth/guards/roles.guards';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ClassAccessService } from '../../organization/class-access/class-access.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuards)
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly classAccess: ClassAccessService,
  ) {}

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Post()
  async create(@Request() req, @Body() dto: CreateEventDto) {
    await this.assertCanWrite(req.user, dto.classId ?? null);
    return this.eventsService.create(dto);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Get()
  async findAll(@Request() req) {
    const ids = await this.classAccess.accessibleClassIds(req.user);
    return this.eventsService.findAll(ids);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const event = await this.eventsService.findOne(+id);
    await this.assertCanRead(req.user, event.classe?.id ?? null);
    return event;
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
  ) {
    const event = await this.eventsService.findOne(+id);
    await this.assertCanWrite(req.user, event.classe?.id ?? null);
    return this.eventsService.update(+id, dto);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const event = await this.eventsService.findOne(+id);
    await this.assertCanWrite(req.user, event.classe?.id ?? null);
    return this.eventsService.remove(+id);
  }

  // Lecture : un événement de toute l'école (classId null) est lisible par tous ;
  // sinon il faut avoir accès à la classe.
  private async assertCanRead(
    user: { id: number; role: UserRole },
    classId: number | null,
  ) {
    if (classId === null) return;
    if (!(await this.classAccess.canAccess(user, classId))) {
      throw new ForbiddenException('You do not have access to this event');
    }
  }

  // Écriture : un événement de toute l'école est réservé ADMIN/PRINCIPAL ;
  // sinon il faut avoir accès à la classe.
  private async assertCanWrite(
    user: { id: number; role: UserRole },
    classId: number | null,
  ) {
    if (classId === null) {
      if (user.role === UserRole.TEACHER) {
        throw new ForbiddenException(
          'Only admins can manage school-wide events',
        );
      }
      return;
    }
    if (!(await this.classAccess.canAccess(user, classId))) {
      throw new ForbiddenException('You do not have access to this event');
    }
  }
}
