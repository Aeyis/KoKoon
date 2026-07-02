import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './entities/event.entity';
import { ClassAccessModule } from '../../organization/class-access/class-access.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), ClassAccessModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
