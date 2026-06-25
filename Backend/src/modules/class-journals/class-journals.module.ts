import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassJournalsService } from './class-journals.service';
import { ClassJournalsController } from './class-journals.controller';
import { ClassJournal } from './entities/class-journal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClassJournal])],
  controllers: [ClassJournalsController],
  providers: [ClassJournalsService],
})
export class ClassJournalsModule {}