import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import {Student} from "./entities/student.entity";
import {User} from "../users/entities/user.entity";


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

  findAll(classIds: number[] | null = null) {
    if (classIds === null) {
      return this.studentRepository.find({ relations: { classe: true, guardians: true } });
    }
    return this.studentRepository.find({
      where: { classe: { id: In(classIds) } },
      relations: { classe: true, guardians: true },
    });
  }

  async findOne(id: number) {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: { classe: true, medicalRecord: true, guardians: true },
    });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return this.studentRepository.update(id, updateStudentDto);
  }

  remove(id: number) {
    return this.studentRepository.delete(id);
  }

  async addGuardian(studentId: number, userId: number) {
    await this.studentRepository.manager
        .createQueryBuilder()
        .relation(User, 'children')
        .of(userId)
        .add(studentId);
    return this.studentRepository.findOne({
      where: { id: studentId },
      relations: { guardians: true },
    });
  }
}