import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Class} from "./entities/class.entity";
import {ClassAccessModule} from "../class-access/class-access.module";

@Module({
  imports: [TypeOrmModule.forFeature([Class]), ClassAccessModule],
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}
