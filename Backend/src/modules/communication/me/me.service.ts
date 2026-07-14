import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Student } from '../../students/entities/student.entity';
import {
  Attendance,
  AttendanceSession,
  AttendanceStatus,
} from '../../school-life/attendance/entities/attendance.entity';
import { ClassJournal } from '../../school-life/class-journals/entities/class-journal.entity';
import { Evaluation } from '../../report-card/evaluations/entities/evaluation.entity';
import { ConductAssessment } from '../../report-card/conduct/entities/conduct-assessment.entity';
import { MedicalRecord } from '../../school-life/medical-records/entities/medical-record.entity';
import { Event } from '../../school-life/events/entities/event.entity';
import { ClassTeacher } from '../../organization/class-teachers/entities/class-teacher.entity';
import { NotificationType } from '../notifications/entities/notification.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateChildMedicalDto } from './dto/update-child-medical.dto';
import { AbsenceScope, ReportAbsenceDto } from './dto/report-absence.dto';

@Injectable()
export class MeService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(ClassJournal)
    private readonly journalRepository: Repository<ClassJournal>,
    @InjectRepository(Evaluation)
    private readonly evaluationRepository: Repository<Evaluation>,
    @InjectRepository(ConductAssessment)
    private readonly conductRepository: Repository<ConductAssessment>,
    @InjectRepository(MedicalRecord)
    private readonly medicalRepository: Repository<MedicalRecord>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(ClassTeacher)
    private readonly classTeacherRepository: Repository<ClassTeacher>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return {
      id: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phone: user?.phone ?? null,
      address: user?.address ?? null,
    };
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    await this.userRepository.update(userId, dto);
    return this.getProfile(userId);
  }

  async getChildMedical(userId: number, childId: number) {
    await this.assertOwnsChild(userId, childId);
    const record = await this.medicalRepository.findOne({
      where: { student: { id: childId } },
    });
    return (
      record ?? {
        allergies: null,
        diet: null,
        medicalConditions: null,
        emergencyContact: null,
      }
    );
  }

  async updateChildMedical(userId: number, childId: number, dto: UpdateChildMedicalDto) {
    await this.assertOwnsChild(userId, childId);
    let record = await this.medicalRepository.findOne({
      where: { student: { id: childId } },
    });
    if (record) {
      Object.assign(record, dto);
    } else {
      record = this.medicalRepository.create({
        ...dto,
        emergencyContact: dto.emergencyContact ?? '',
        student: { id: childId } as Student,
      });
    }
    return this.medicalRepository.save(record);
  }

  async getChildEvents(userId: number, childId: number) {
    await this.assertOwnsChild(userId, childId);
    const child = await this.studentRepository.findOne({
      where: { id: childId },
      relations: { classe: true },
    });
    const where = child?.classe
      ? [{ classe: { id: child.classe.id } }, { classe: IsNull() }]
      : [{ classe: IsNull() }];
    return this.eventRepository.find({ where, order: { date: 'ASC' } });
  }

  async getChildren(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { children: true },
    });
    return user?.children ?? [];
  }

  getNotifications(userId: number) {
    return this.notificationsService.findForUser(userId);
  }

  async getChildAttendance(userId: number, childId: number) {
    await this.assertOwnsChild(userId, childId);
    return this.attendanceRepository.find({
      where: { student: { id: childId } },
      order: { date: 'DESC' },
    });
  }

  async getChildJournal(userId: number, childId: number) {
    await this.assertOwnsChild(userId, childId);
    const child = await this.studentRepository.findOne({
      where: { id: childId },
      relations: { classe: true },
    });
    if (!child?.classe) return [];
    return this.journalRepository.find({
      where: { classe: { id: child.classe.id } },
      relations: { subject: true },
    });
  }

  async getChildEvaluations(userId: number, childId: number) {
    await this.assertOwnsChild(userId, childId);
    return this.evaluationRepository.find({
      where: { student: { id: childId } },
      relations: { subject: true, period: true, student: true },
    });
  }

  async getChildConduct(userId: number, childId: number) {
    await this.assertOwnsChild(userId, childId);
    return this.conductRepository.find({
      where: { student: { id: childId } },
      relations: { item: true, period: true, student: true },
    });
  }

  async reportAbsence(userId: number, childId: number, dto: ReportAbsenceDto) {
    await this.assertOwnsChild(userId, childId);

    const sessions =
      dto.scope === AbsenceScope.FULL_DAY
        ? [AttendanceSession.MORNING, AttendanceSession.AFTERNOON]
        : dto.scope === AbsenceScope.MORNING
          ? [AttendanceSession.MORNING]
          : [AttendanceSession.AFTERNOON];

    for (const session of sessions) {
      let record = await this.attendanceRepository.findOne({
        where: { student: { id: childId }, date: dto.date, session },
      });
      if (record) {
        record.status = AttendanceStatus.ABSENT;
        if (dto.reason) record.justification = dto.reason;
      } else {
        record = this.attendanceRepository.create({
          date: dto.date,
          session,
          status: AttendanceStatus.ABSENT,
          justification: dto.reason,
          student: { id: childId } as Student,
        });
      }
      await this.attendanceRepository.save(record);
    }

    const child = await this.studentRepository.findOne({
      where: { id: childId },
      relations: { classe: true },
    });
    if (child?.classe) {
      const teachers = await this.classTeacherRepository.find({
        where: { classe: { id: child.classe.id } },
        relations: { teacher: true },
      });
      const scopeLabel =
        dto.scope === AbsenceScope.FULL_DAY
          ? 'all day'
          : dto.scope === AbsenceScope.MORNING
            ? 'in the morning'
            : 'in the afternoon';
      const content = `${child.firstName} ${child.lastName} will be absent on ${dto.date} (${scopeLabel}).${
        dto.reason ? ' Reason: ' + dto.reason : ''
      }`;
      for (const ct of teachers) {
        await this.notificationsService.create({
          type: NotificationType.ABSENCE,
          content,
          recipientId: ct.teacher.id,
        });
      }
    }

    return { success: true };
  }

  private async assertOwnsChild(userId: number, childId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { children: true },
    });
    const owns = user?.children?.some((child) => child.id === childId);
    if (!owns) {
      throw new ForbiddenException("Cet enfant n'est pas rattaché à votre compte");
    }
  }
}
