import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { User } from '../../users/entities/user.entity';
import { Attendance } from '../../school-life/attendance/entities/attendance.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Attendance]), NotificationsModule],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}
