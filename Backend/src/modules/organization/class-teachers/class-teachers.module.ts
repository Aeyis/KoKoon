import { Module } from '@nestjs/common';
import { ClassTeachersService } from './class-teachers.service';
import { ClassTeachersController } from './class-teachers.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ClassTeacher} from "./entities/class-teacher.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ClassTeacher])],
  controllers: [ClassTeachersController],
  providers: [ClassTeachersService],
})
export class ClassTeachersModule {}
