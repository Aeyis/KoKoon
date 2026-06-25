import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Attendance } from '../../school-life/attendance/entities/attendance.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MeService {
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      @InjectRepository(Attendance)
      private readonly attendanceRepository: Repository<Attendance>,
      private readonly notificationsService: NotificationsService,
  ) {}

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