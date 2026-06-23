import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
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
  findAll() { return this.classRepository.find(); }
  update(id:number, dto: UpdateClassDto) {
    return this.classRepository.update(id, dto)
        ;}
  findOne(id:number) { return this.classRepository.findOneBy({id}); }
  remove(id:number) { return this.classRepository.delete(id); }
}
