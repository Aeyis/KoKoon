import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { User } from '../../users/entities/user.entity';
import { Student } from '../../students/entities/student.entity';
import { Attendance } from '../../school-life/attendance/entities/attendance.entity';
import { ClassJournal } from '../../school-life/class-journals/entities/class-journal.entity';
import { Evaluation } from '../../report-card/evaluations/entities/evaluation.entity';
import { ConductAssessment } from '../../report-card/conduct/entities/conduct-assessment.entity';
import { MedicalRecord } from '../../school-life/medical-records/entities/medical-record.entity';
import { Event } from '../../school-life/events/entities/event.entity';
import { ClassTeacher } from '../../organization/class-teachers/entities/class-teacher.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Student,
      Attendance,
      ClassJournal,
      Evaluation,
      ConductAssessment,
      MedicalRecord,
      Event,
      ClassTeacher,
    ]),
    NotificationsModule,
  ],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}
