import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsController } from './evaluations.controller';
import { Evaluation } from './entities/evaluation.entity';
import { ClassAccessModule } from '../../organization/class-access/class-access.module';

@Module({
  imports: [TypeOrmModule.forFeature([Evaluation]), ClassAccessModule],
  controllers: [EvaluationsController],
  providers: [EvaluationsService],
})
export class EvaluationsModule {}