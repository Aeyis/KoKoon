import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import {Class} from "./entities/class.entity";

@Injectable()
export class ClassesService {
  constructor(
      @InjectRepository(Class)
      private readonly classRepository: Repository<Class>,
  ) {}

  create(dto: CreateClassDto) {
    const entity = this.classRepository.create(dto);
    return this.classRepository.save(entity);
  }

  findAll(classIds: number[] | null = null) {
    if (classIds === null) {
      return this.classRepository.find({ relations: { students: true } });
    }
    return this.classRepository.find({ where: { id: In(classIds) }, relations: { students: true } });
  }

  update(id:number, dto: UpdateClassDto) {
    return this.classRepository.update(id, dto);
  }

  async findOne(id:number) {
    const classe = await this.classRepository.findOne({where:{id}, relations: {students:true}});
    if (!classe) throw new NotFoundException('Class not found');
    return classe;
  }

  remove(id:number) { return this.classRepository.delete(id); }
}
