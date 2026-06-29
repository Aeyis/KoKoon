import { Module } from '@nestjs/common';
import { BehaviorsService } from './behaviors.service';
import { BehaviorsController } from './behaviors.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Behavior} from "./entities/behavior.entity";
import {ClassAccessModule} from "../../organization/class-access/class-access.module";

@Module({
  imports: [TypeOrmModule.forFeature([Behavior]), ClassAccessModule],
  controllers: [BehaviorsController],
  providers: [BehaviorsService],
})
export class BehaviorsModule {}
