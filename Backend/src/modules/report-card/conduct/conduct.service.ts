import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ConductItem } from './entities/conduct-item.entity';
import { ConductAssessment } from './entities/conduct-assessment.entity';
import { CreateConductAssessmentDto } from './dto/create-conduct-assessment.dto';
import { UpdateConductAssessmentDto } from './dto/update-conduct-assessment.dto';

@Injectable()
export class ConductService {
  constructor(
    @InjectRepository(ConductItem)
    private readonly itemRepository: Repository<ConductItem>,
    @InjectRepository(ConductAssessment)
    private readonly assessmentRepository: Repository<ConductAssessment>,
  ) {}

  findItems() {
    return this.itemRepository.find({ order: { position: 'ASC', id: 'ASC' } });
  }

  findAssessments(classIds: number[] | null = null) {
    if (classIds === null) {
      return this.assessmentRepository.find({
        relations: { student: true, item: true, period: true },
      });
    }
    return this.assessmentRepository.find({
      where: { student: { classe: { id: In(classIds) } } },
      relations: { student: true, item: true, period: true },
    });
  }

  async create(dto: CreateConductAssessmentDto) {
    const existing = await this.assessmentRepository.findOne({
      where: {
        student: { id: dto.studentId },
        item: { id: dto.itemId },
        period: { id: dto.periodId },
      },
    });
    if (existing) {
      existing.level = dto.level;
      return this.assessmentRepository.save(existing);
    }
    const assessment = this.assessmentRepository.create({
      level: dto.level,
      student: { id: dto.studentId },
      item: { id: dto.itemId },
      period: { id: dto.periodId },
    });
    return this.assessmentRepository.save(assessment);
  }

  async findOne(id: number) {
    const assessment = await this.assessmentRepository.findOne({
      where: { id },
      relations: { student: { classe: true }, item: true, period: true },
    });
    if (!assessment) throw new NotFoundException('Conduct assessment not found');
    return assessment;
  }

  update(id: number, dto: UpdateConductAssessmentDto) {
    return this.assessmentRepository.update(id, dto);
  }
}
