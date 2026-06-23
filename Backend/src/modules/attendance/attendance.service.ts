import {ConflictException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
      @InjectRepository(Attendance)
      private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  async create(dto: CreateAttendanceDto) {
    const att = this.attendanceRepository.create({
      ...dto,
      student: { id: dto.studentId },
    });
    try {
      return await this.attendanceRepository.save(att);
    } catch (e) {
      if (e.code === '23505'){
        throw new ConflictException('Attendance already recorded for this half-day')
      }
      throw e;
    }
  }

  findAll() { return this.attendanceRepository.find({ relations: { student: true } }); }
  findOne(id: number) { return this.attendanceRepository.findOne({ where: { id }, relations: { student: true } }); }
  update(id: number, dto: UpdateAttendanceDto) { return this.attendanceRepository.update(id, dto); }
  remove(id: number) { return this.attendanceRepository.delete(id); }
}