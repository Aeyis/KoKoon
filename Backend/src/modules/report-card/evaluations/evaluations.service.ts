import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluation } from './entities/evaluation.entity';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';

@Injectable()
export class EvaluationsService {
  constructor(
      @InjectRepository(Evaluation)
      private readonly evaluationRepository: Repository<Evaluation>,
  ) {}

  create(dto: CreateEvaluationDto) {
    const evaluation = this.evaluationRepository.create({
      title: dto.title,
      score: dto.score,
      maxScore: dto.maxScore,
      date: dto.date,
      student: { id: dto.studentId },
      subject: { id: dto.subjectId },
      period: { id: dto.periodId },
    });
    return this.evaluationRepository.save(evaluation);
  }

  findAll() {
    return this.evaluationRepository.find({ relations: { student: true, subject: true, period: true } });
  }

  findOne(id: number) {
    return this.evaluationRepository.findOne({
      where: { id },
      relations: { student: true, subject: true, period: true },
    });
  }

  update(id: number, dto: UpdateEvaluationDto) {
    return this.evaluationRepository.update(id, dto);
  }

  remove(id: number) {
    return this.evaluationRepository.delete(id);
  }
}