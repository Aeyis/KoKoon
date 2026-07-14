import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { User, UserRole } from '../../users/entities/user.entity';
import { Student } from '../../students/entities/student.entity';
import { ClassTeacher } from '../../organization/class-teachers/entities/class-teacher.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(ClassTeacher)
    private readonly classTeacherRepository: Repository<ClassTeacher>,
  ) {}

  create(senderId: number, dto: CreateMessageDto) {
    const message = this.messageRepository.create({
      content: dto.content,
      sender: { id: senderId },
      recipient: { id: dto.recipientId },
    });
    return this.messageRepository.save(message);
  }

  inbox(userId: number) {
    return this.messageRepository.find({
      where: { recipient: { id: userId } },
      relations: { sender: true },
      order: { createdAt: 'DESC' },
    });
  }

  sent(userId: number) {
    return this.messageRepository.find({
      where: { sender: { id: userId } },
      relations: { recipient: true },
      order: { createdAt: 'DESC' },
    });
  }

  markAsRead(id: number) {
    return this.messageRepository.update(id, { isRead: true });
  }

  remove(id: number) {
    return this.messageRepository.delete(id);
  }

  // ---- Conversations (grouped by the other participant) ----
  async conversations(userId: number) {
    const messages = await this.messageRepository.find({
      where: [{ sender: { id: userId } }, { recipient: { id: userId } }],
      relations: { sender: true, recipient: true },
      order: { createdAt: 'DESC' },
    });

    const byOther = new Map<
      number,
      { user: User; lastMessage: string; lastAt: Date; unread: number }
    >();

    for (const m of messages) {
      const other = m.sender.id === userId ? m.recipient : m.sender;
      let entry = byOther.get(other.id);
      if (!entry) {
        entry = { user: other, lastMessage: m.content, lastAt: m.createdAt, unread: 0 };
        byOther.set(other.id, entry);
      }
      if (m.recipient.id === userId && !m.isRead) entry.unread += 1;
    }

    return [...byOther.values()].map((e) => ({
      user: {
        id: e.user.id,
        firstName: e.user.firstName,
        lastName: e.user.lastName,
        role: e.user.role,
      },
      lastMessage: e.lastMessage,
      lastAt: e.lastAt,
      unread: e.unread,
    }));
  }

  // ---- Full thread between me and another user (marks incoming as read) ----
  async thread(userId: number, otherId: number) {
    const messages = await this.messageRepository.find({
      where: [
        { sender: { id: userId }, recipient: { id: otherId } },
        { sender: { id: otherId }, recipient: { id: userId } },
      ],
      relations: { sender: true, recipient: true },
      order: { createdAt: 'ASC' },
    });

    const unreadIds = messages
      .filter((m) => m.recipient.id === userId && !m.isRead)
      .map((m) => m.id);
    if (unreadIds.length) {
      await this.messageRepository.update(unreadIds, { isRead: true });
    }

    return messages.map((m) => ({
      id: m.id,
      content: m.content,
      createdAt: m.createdAt,
      mine: m.sender.id === userId,
    }));
  }

  // ---- Valid recipients depending on the role ----
  async contacts(userId: number, role: UserRole) {
    if (role === UserRole.RESPONSABLE) {
      // teachers of the parent's children's classes
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: { children: { classe: true } },
      });
      const classIds = (user?.children ?? [])
        .map((c) => c.classe?.id)
        .filter((id): id is number => id != null);
      if (!classIds.length) return [];
      const links = await this.classTeacherRepository.find({
        where: classIds.map((id) => ({ classe: { id } })),
        relations: { teacher: true },
      });
      return this._distinctUsers(links.map((l) => l.teacher));
    }

    if (role === UserRole.TEACHER) {
      // guardians of the students in the teacher's classes
      const links = await this.classTeacherRepository.find({
        where: { teacher: { id: userId } },
        relations: { classe: true },
      });
      const classIds = links.map((l) => l.classe.id);
      if (!classIds.length) return [];
      const students = await this.studentRepository.find({
        where: classIds.map((id) => ({ classe: { id } })),
        relations: { guardians: true },
      });
      const guardians = students.flatMap((s) => s.guardians ?? []);
      return this._distinctUsers(guardians);
    }

    return [];
  }

  private _distinctUsers(users: User[]) {
    const map = new Map<number, { id: number; firstName: string; lastName: string; role: UserRole }>();
    for (const u of users) {
      if (!map.has(u.id)) {
        map.set(u.id, { id: u.id, firstName: u.firstName, lastName: u.lastName, role: u.role });
      }
    }
    return [...map.values()];
  }
}
