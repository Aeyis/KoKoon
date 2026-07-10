import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
      competency: dto.competency ?? null,
      score: dto.score ?? null,
      maxScore: dto.maxScore ?? null,
      grade: dto.grade ?? null,
      date: dto.date,
      student: { id: dto.studentId },
      subject: { id: dto.subjectId },
      period: { id: dto.periodId },
    });
    return this.evaluationRepository.save(evaluation);
  }

  findAll(classIds: number[] | null = null) {
    if (classIds === null) {
      return this.evaluationRepository.find({ relations: { student: true, subject: true, period: true } });
    }
    return this.evaluationRepository.find({
      where: { student: { classe: { id: In(classIds) } } },
      relations: { student: true, subject: true, period: true },
    });
  }

  async findOne(id: number) {
    const evaluation = await this.evaluationRepository.findOne({
      where: { id },
      relations: { student: { classe: true }, subject: true, period: true },
    });
    if (!evaluation) throw new NotFoundException('Evaluation not found');
    return evaluation;
  }

  update(id: number, dto: UpdateEvaluationDto) {
    return this.evaluationRepository.update(id, dto);
  }

  remove(id: number) {
    return this.evaluationRepository.delete(id);
  }
}