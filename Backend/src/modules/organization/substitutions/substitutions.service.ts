import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { CreateSubstitutionDto } from './dto/create-substitution.dto';
import { UpdateSubstitutionDto } from './dto/update-substitution.dto';
import { Substitution } from "./entities/substitution.entity";

@Injectable()
export class SubstitutionsService {
  constructor(
      @InjectRepository(Substitution)
      private readonly substitutionRepository: Repository<Substitution>,
  ) {}

  create(dto: CreateSubstitutionDto) {
    const entity = this.substitutionRepository.create({
      substitute: { id: dto.substituteId },
      classe: { id: dto.classeId },
      startDate: dto.startDate,
      endDate: dto.endDate,
    });
    return this.substitutionRepository.save(entity);
  }

  findAll() {
    return this.substitutionRepository.find({ relations: { substitute: true, classe: true } });
  }

  findOne(id: number) {
    return this.substitutionRepository.findOne({ where: { id }, relations: { substitute: true, classe: true } });
  }

  update(id: number, dto: UpdateSubstitutionDto) {
    return this.substitutionRepository.update(id, {
      startDate: dto.startDate,
      endDate: dto.endDate,
    });
  }

  remove(id: number) {
    return this.substitutionRepository.delete(id);
  }

  findActiveForClass(classeId: number) {
    const today = new Date().toISOString().slice(0, 10);
    return this.substitutionRepository.findOne({
      where: {
        classe: { id: classeId },
        startDate: LessThanOrEqual(today),
        endDate: MoreThanOrEqual(today),
      },
      relations: { substitute: true, classe: true },
    });
  }
}