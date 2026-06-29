import { Injectable } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {School} from "./entities/school.entity";
import * as crypto from 'crypto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class SchoolsService {
  constructor(
      @InjectRepository(School)
      private readonly schoolRepository: Repository<School>,
  ) {}
  create(dto: CreateSchoolDto) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase(); // ex: "A1B2C3D4"
    const school = this.schoolRepository.create({ ...dto, code });
    return this.schoolRepository.save(school);
  }

  findAll() {
    return this.schoolRepository.find();
  }

  findOne(id: number) {
    return this.schoolRepository.findOne({ where: { id }, relations: { staff: true } });
  }

  update(id: number, dto: UpdateSchoolDto) {
    return this.schoolRepository.update(id, dto);
  }

  remove(id: number) {
    return this.schoolRepository.delete(id);
  }

  async addStaff(schoolId: number, userId: number) {
    await this.schoolRepository
        .createQueryBuilder()
        .relation(School, 'staff')
        .of(schoolId)
        .add(userId);
    return this.findOne(schoolId);
  }

  async removeStaff(schoolId: number, userId: number) {
    await this.schoolRepository
        .createQueryBuilder()
        .relation(School, 'staff')
        .of(schoolId)
        .remove(userId);
    return this.findOne(schoolId);
  }

  async joinByCode(code: string, userId: number) {
    const school = await this.schoolRepository.findOneBy({ code });
    if (!school) {
      throw new NotFoundException('Invalid school code');
    }
    return this.addStaff(school.id, userId);
  }
}
