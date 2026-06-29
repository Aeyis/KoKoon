import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassJournalsService } from './class-journals.service';
import { ClassJournalsController } from './class-journals.controller';
import { ClassJournal } from './entities/class-journal.entity';
import { ClassAccessModule } from '../../organization/class-access/class-access.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClassJournal]), ClassAccessModule],
  controllers: [ClassJournalsController],
  providers: [ClassJournalsService],
})
export class ClassJournalsModule {}