import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateClassTeacherDto } from './dto/create-class-teacher.dto';
import { UpdateClassTeacherDto } from './dto/update-class-teacher.dto';
import { ClassTeacher } from "./entities/class-teacher.entity";

@Injectable()
export class ClassTeachersService {
  constructor(
      @InjectRepository(ClassTeacher)
      private readonly classTeacherRepository: Repository<ClassTeacher>,
  ) {}

  create(dto: CreateClassTeacherDto) {
    const entity = this.classTeacherRepository.create({
      teacher: { id: dto.teacherId },
      classe: { id: dto.classeId },
      role: dto.role,
    });
    return this.classTeacherRepository.save(entity);
  }

  findAll() {
    return this.classTeacherRepository.find({ relations: { teacher: true, classe: true } });
  }

  findOne(id: number) {
    return this.classTeacherRepository.findOne({ where: { id }, relations: { teacher: true, classe: true } });
  }

  update(id: number, dto: UpdateClassTeacherDto) {
    return this.classTeacherRepository.update(id, { role: dto.role });
  }

  remove(id: number) {
    return this.classTeacherRepository.delete(id);
  }
}