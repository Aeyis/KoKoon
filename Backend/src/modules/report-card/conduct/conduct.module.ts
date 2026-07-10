import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConductService } from './conduct.service';
import { ConductController } from './conduct.controller';
import { ConductItem } from './entities/conduct-item.entity';
import { ConductAssessment } from './entities/conduct-assessment.entity';
import { ClassAccessModule } from '../../organization/class-access/class-access.module';

@Module({
  imports: [TypeOrmModule.forFeature([ConductItem, ConductAssessment]), ClassAccessModule],
  controllers: [ConductController],
  providers: [ConductService],
})
export class ConductModule {}
