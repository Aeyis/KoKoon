import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  findAll(classIds: number[] | null = null) {
    if (classIds === null) {
      return this.behaviorRepository.find({ relations: { student: true } });
    }
    return this.behaviorRepository.find({
      where: { student: { classe: { id: In(classIds) } } },
      relations: { student: true },
    });
  }

  async findOne(id: number) {
    const behavior = await this.behaviorRepository.findOne({ where: { id }, relations: { student: { classe: true } } });
    if (!behavior) throw new NotFoundException('Behavior not found');
    return behavior;
  }

  update(id: number, dto: UpdateBehaviorDto) {
    return this.behaviorRepository.update(id, dto);
  }

  remove(id: number) {
    return this.behaviorRepository.delete(id);
  }
}
