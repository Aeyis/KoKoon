import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message } from './entities/message.entity';
import { User } from '../../users/entities/user.entity';
import { Student } from '../../students/entities/student.entity';
import { ClassTeacher } from '../../organization/class-teachers/entities/class-teacher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, Student, ClassTeacher])],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}

