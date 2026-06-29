import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Student} from "./entities/student.entity";
import {ClassAccessModule} from "../organization/class-access/class-access.module";

@Module({
  imports: [TypeOrmModule.forFeature([Student]), ClassAccessModule],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}