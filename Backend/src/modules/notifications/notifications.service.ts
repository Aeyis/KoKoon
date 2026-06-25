import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { Student } from '../students/entities/student.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
      @InjectRepository(Notification)
      private readonly notificationRepository: Repository<Notification>,
      @InjectRepository(Student)
      private readonly studentRepository: Repository<Student>,
  ) {}

  create(dto: CreateNotificationDto) {
    const notification = this.notificationRepository.create({
      type: dto.type,
      content: dto.content,
      recipient: { id: dto.recipientId },
    });
    return this.notificationRepository.save(notification);
  }

  findAll() {
    return this.notificationRepository.find({ relations: { recipient: true } });
  }

  findForUser(userId: number) {
    return this.notificationRepository.find({
      where: { recipient: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  markAsRead(id: number) {
    return this.notificationRepository.update(id, { isRead: true });
  }

  remove(id: number) {
    return this.notificationRepository.delete(id);
  }

  // ---- Auto-notif d'absence ----
  async notifyAbsence(studentId: number) {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      relations: { guardians: true },
    });
    if (!student || !student.guardians?.length) return;

    const notifications = student.guardians.map((guardian) =>
        this.notificationRepository.create({
          type: NotificationType.ABSENCE,
          content: `${student.firstName} ${student.lastName} a été noté(e) absent(e). Merci de fournir un justificatif.`,
          recipient: { id: guardian.id },
          isRead: false,
        }),
    );
    return this.notificationRepository.save(notifications);
  }
}
