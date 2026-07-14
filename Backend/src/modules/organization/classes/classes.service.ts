import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import {Class, SeatingPlan} from "./entities/class.entity";
import {School} from "../schools/entities/school.entity";

@Injectable()
export class ClassesService {
  constructor(
      @InjectRepository(Class)
      private readonly classRepository: Repository<Class>,
  ) {}

  create(dto: CreateClassDto) {
    const { schoolId, ...rest } = dto;
    const entity = this.classRepository.create({
      ...rest,
      school: schoolId ? ({ id: schoolId } as School) : undefined,
    });
    return this.classRepository.save(entity);
  }

  findAll(classIds: number[] | null = null) {
    if (classIds === null) {
      return this.classRepository.find({ relations: { students: true, school: true } });
    }
    return this.classRepository.find({
      where: { id: In(classIds) },
      relations: { students: true, school: true },
    });
  }

  update(id:number, dto: UpdateClassDto) {
    return this.classRepository.update(id, dto);
  }

  async findOne(id:number) {
    const classe = await this.classRepository.findOne({where:{id}, relations: {students:true}});
    if (!classe) throw new NotFoundException('Class not found');
    return classe;
  }

  async getSeating(id: number) {
    const classe = await this.findOne(id);
    return classe.seating ?? null;
  }

  async setSeating(id: number, seating: SeatingPlan) {
    await this.classRepository.update(id, { seating });
    return seating;
  }

  remove(id:number) { return this.classRepository.delete(id); }
}
