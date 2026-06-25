import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
      @InjectRepository(Subject)
      private readonly subjectRepository: Repository<Subject>,
  ) {}

  create(dto: CreateSubjectDto) {
    return this.subjectRepository.save(this.subjectRepository.create(dto));
  }
  findAll() { return this.subjectRepository.find(); }
  findOne(id: number) { return this.subjectRepository.findOne({ where: { id } }); }
  update(id: number, dto: UpdateSubjectDto) { return this.subjectRepository.update(id, dto); }
  remove(id: number) { return this.subjectRepository.delete(id); }
}
