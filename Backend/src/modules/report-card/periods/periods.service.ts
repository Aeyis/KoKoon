import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Period } from './entities/period.entity';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';

@Injectable()
export class PeriodsService {
  constructor(
    @InjectRepository(Period)
    private readonly periodRepository: Repository<Period>,
  ) {}

  create(dto: CreatePeriodDto) {
    return this.periodRepository.save(this.periodRepository.create(dto));
  }
  findAll() { return this.periodRepository.find(); }
  findOne(id: number) { return this.periodRepository.findOne({ where: { id } }); }
  update(id: number, dto: UpdatePeriodDto) { return this.periodRepository.update(id, dto); }
  remove(id: number) { return this.periodRepository.delete(id); }
}