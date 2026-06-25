import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(
      @InjectRepository(Message)
      private readonly messageRepository: Repository<Message>,
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
}
