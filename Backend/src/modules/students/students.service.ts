import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Student} from "./entities/student.entity";


@Injectable()
export class StudentsService {
  constructor(
      @InjectRepository(Student)
      private readonly studentRepository: Repository<Student>,
  ) {}
  create(createStudentDto: CreateStudentDto) {
    const student = this.studentRepository.create({
      ...createStudentDto,
      classe: createStudentDto.classId? { id: createStudentDto.classId } : undefined,
    });
    return this.studentRepository.save(student);
  }

  findAll() {
    return this.studentRepository.find({ relations: {classe:true} });
  }

  findOne(id: number) {
    return this.studentRepository.findOne({ where : {id}, relations: {classe:true} });
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return this.studentRepository.update(id, updateStudentDto);
  }

  remove(id: number) {
    return this.studentRepository.delete(id);
  }

}