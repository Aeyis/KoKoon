import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Behavior } from './entities/behavior.entity';
import { CreateBehaviorDto } from './dto/create-behavior.dto';
import { UpdateBehaviorDto } from './dto/update-behavior.dto';

@Injectable()
export class BehaviorsService {
  constructor(
      @InjectRepository(Behavior)
      private readonly behaviorRepository: Repository<Behavior>,
  ) {}

  create(dto: CreateBehaviorDto) {
    const behavior = this.behaviorRepository.create({
      ...dto,
      student: { id: dto.studentId },
    });
    return this.behaviorRepository.save(behavior);
  }

  findAll() {
    return this.behaviorRepository.find({ relations: { student: true } });
  }

  findOne(id: number) {
    return this.behaviorRepository.findOne({ where: { id }, relations: { student: true } });
  }

  update(id: number, dto: UpdateBehaviorDto) {
    return this.behaviorRepository.update(id, dto);
  }

  remove(id: number) {
    return this.behaviorRepository.delete(id);
  }
}
