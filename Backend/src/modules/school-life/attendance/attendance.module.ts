import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Student } from '../../students/entities/student.entity';
import { NotificationsModule } from '../../communication/notifications/notifications.module';
import { ClassAccessModule } from '../../organization/class-access/class-access.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, Student]), NotificationsModule, ClassAccessModule],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}