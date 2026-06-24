import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecord } from './entities/medical-record.entity';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';

@Injectable()
export class MedicalRecordsService {
  constructor(
      @InjectRepository(MedicalRecord)
      private readonly medicalRecordRepository: Repository<MedicalRecord>,
  ) {}

  async create(dto: CreateMedicalRecordDto) {
    const record = this.medicalRecordRepository.create({
      ...dto,
      student: { id: dto.studentId },
    });
    try {
      return await this.medicalRecordRepository.save(record);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('This student already has a medical record');
      }
      throw e;
    }
  }

  findAll() {
    return this.medicalRecordRepository.find({ relations: { student: true } });
  }

  findOne(id: number) {
    return this.medicalRecordRepository.findOne({ where: { id }, relations: { student: true } });
  }

  update(id: number, dto: UpdateMedicalRecordDto) {
    return this.medicalRecordRepository.update(id, dto);
  }

  remove(id: number) {
    return this.medicalRecordRepository.delete(id);
  }
}
