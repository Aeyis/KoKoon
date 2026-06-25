import { Injectable } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {School} from "./entities/school.entity";

@Injectable()
export class SchoolsService {
  constructor(
      @InjectRepository(School)
      private readonly schoolRepository: Repository<School>,
  ) {}
  create(dto: CreateSchoolDto) {
    const school = this.schoolRepository.create(dto);
    return this.schoolRepository.save(school);
  }

  findAll() {
    return this.schoolRepository.find();
  }

  findOne(id: number) {
    return this.schoolRepository.findOne({ where: { id } });
  }

  update(id: number, dto: UpdateSchoolDto) {
    return this.schoolRepository.update(id, dto);
  }

  remove(id: number) {
    return this.schoolRepository.delete(id);
  }
}
