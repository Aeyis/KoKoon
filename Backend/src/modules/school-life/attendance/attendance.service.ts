import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Attendance, AttendanceStatus } from './entities/attendance.entity';
import { Student } from '../../students/entities/student.entity';
import { NotificationsService } from '../../communication/notifications/notifications.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';


@Injectable()
export class AttendanceService {
  constructor(
      @InjectRepository(Attendance)
      private readonly attendanceRepository: Repository<Attendance>,
      @InjectRepository(Student)
      private readonly studentRepository: Repository<Student>,
      private readonly notificationsService: NotificationsService,
  ) {}

  async studentClassId(studentId: number): Promise<number | null> {
    const student = await this.studentRepository.findOne({ where: { id: studentId }, relations: { classe: true } });
    if (!student) throw new NotFoundException('Student not found');
    return student.classe?.id ?? null;
  }

  async create(dto: CreateAttendanceDto) {
    const att = this.attendanceRepository.create({
      ...dto,
      student: { id: dto.studentId },
    });
    let saved: Attendance;
    try {
      saved = await this.attendanceRepository.save(att);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('Attendance already recorded for this half-day');
      }
      throw e;
    }
    if (dto.status === AttendanceStatus.ABSENT) {
      await this.notificationsService.notifyAbsence(dto.studentId);
    }
    return saved;
  }


  findAll(classIds: number[] | null = null) {
    if (classIds === null) {
      return this.attendanceRepository.find({ relations: { student: true } });
    }
    return this.attendanceRepository.find({
      where: { student: { classe: { id: In(classIds) } } },
      relations: { student: true },
    });
  }

  async findOne(id: number) {
    const att = await this.attendanceRepository.findOne({ where: { id }, relations: { student: { classe: true } } });
    if (!att) throw new NotFoundException('Attendance not found');
    return att;
  }

  update(id: number, dto: UpdateAttendanceDto) { return this.attendanceRepository.update(id, dto); }
  remove(id: number) { return this.attendanceRepository.delete(id); }
}