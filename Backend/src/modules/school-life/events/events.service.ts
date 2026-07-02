import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  create(dto: CreateEventDto) {
    const event = this.eventRepository.create({
      title: dto.title,
      date: dto.date,
      allDay: dto.allDay ?? false,
      startTime: dto.startTime ?? null,
      endTime: dto.endTime ?? null,
      location: dto.location ?? null,
      description: dto.description ?? null,
      category: dto.category ?? null,
      classe: dto.classId ? { id: dto.classId } : null,
    });
    return this.eventRepository.save(event);
  }

  findAll(classIds: number[] | null = null) {
    if (classIds === null) {
      return this.eventRepository.find({
        relations: { classe: true },
        order: { date: 'ASC' },
      });
    }
    // événements de toute l'école (classe null) + ceux des classes accessibles
    return this.eventRepository.find({
      where: [{ classe: IsNull() }, { classe: { id: In(classIds) } }],
      relations: { classe: true },
      order: { date: 'ASC' },
    });
  }

  async findOne(id: number) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: { classe: true },
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  update(id: number, dto: UpdateEventDto) {
    const { classId, ...rest } = dto;
    return this.eventRepository.update(id, {
      ...rest,
      ...(classId !== undefined
        ? { classe: classId ? { id: classId } : null }
        : {}),
    });
  }

  remove(id: number) {
    return this.eventRepository.delete(id);
  }
}
