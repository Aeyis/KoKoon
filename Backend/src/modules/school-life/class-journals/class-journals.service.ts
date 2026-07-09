import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ClassJournal } from './entities/class-journal.entity';
import { CreateClassJournalDto } from './dto/create-class-journal.dto';
import { UpdateClassJournalDto } from './dto/update-class-journal.dto';

@Injectable()
export class ClassJournalsService {
  constructor(
    @InjectRepository(ClassJournal)
    private readonly classJournalRepository: Repository<ClassJournal>,
  ) {}

  create(dto: CreateClassJournalDto) {
    const entry = this.classJournalRepository.create({
      date: dto.date,
      period: dto.period ?? null,
      title: dto.title ?? null,
      color: dto.color ?? null,
      content: dto.content,
      homework: dto.homework,
      preparation: dto.preparation,
      done: dto.done ?? false,
      category: dto.category ?? null,
      classe: { id: dto.classId },
      subject: dto.subjectId ? { id: dto.subjectId } : undefined,
    });
    return this.classJournalRepository.save(entry);
  }

  findAll(classIds: number[] | null = null) {
    if (classIds === null) {
      return this.classJournalRepository.find({
        relations: { classe: true, subject: true },
      });
    }
    return this.classJournalRepository.find({
      where: { classe: { id: In(classIds) } },
      relations: { classe: true, subject: true },
    });
  }

  async findOne(id: number) {
    const entry = await this.classJournalRepository.findOne({
      where: { id },
      relations: { classe: true, subject: true },
    });
    if (!entry) throw new NotFoundException('Class journal not found');
    return entry;
  }

  async update(id: number, dto: UpdateClassJournalDto) {
    const entry = await this.findOne(id);
    const { subjectId, classId, ...rest } = dto as any;
    Object.assign(entry, rest);
    if (subjectId !== undefined) {
      entry.subject = subjectId === null ? null : ({ id: subjectId } as any);
    }
    return this.classJournalRepository.save(entry);
  }

  remove(id: number) {
    return this.classJournalRepository.delete(id);
  }
}
