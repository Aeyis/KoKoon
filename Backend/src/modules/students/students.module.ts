import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Student} from "./entities/student.entity";
import {ClassAccessModule} from "../organization/class-access/class-access.module";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Student]), ClassAccessModule, UsersModule],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}