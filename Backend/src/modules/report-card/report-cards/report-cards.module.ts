import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportCardsService } from './report-cards.service';
import { ReportCardsController } from './report-cards.controller';
import { ReportCard } from './entities/report-card.entity';
import { Evaluation } from '../evaluations/entities/evaluation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReportCard, Evaluation])],
  controllers: [ReportCardsController],
  providers: [ReportCardsService],
})
export class ReportCardsModule {}