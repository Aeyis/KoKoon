import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      content: dto.content,
      homework: dto.homework,
      preparation: dto.preparation,
      classe: { id: dto.classId },
      subject: dto.subjectId ? { id: dto.subjectId } : undefined,
    });
    return this.classJournalRepository.save(entry);
  }

  findAll() {
    return this.classJournalRepository.find({ relations: { classe: true, subject: true } });
  }

  findOne(id: number) {
    return this.classJournalRepository.findOne({ where: { id }, relations: { classe: true, subject: true } });
  }

  update(id: number, dto: UpdateClassJournalDto) {
    return this.classJournalRepository.update(id, dto);
  }

  remove(id: number) {
    return this.classJournalRepository.delete(id);
  }
}