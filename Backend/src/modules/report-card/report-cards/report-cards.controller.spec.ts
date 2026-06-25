import { Test, TestingModule } from '@nestjs/testing';
import { ReportCardsController } from './report-cards.controller';
import { ReportCardsService } from './report-cards.service';

describe('ReportCardsController', () => {
  let controller: ReportCardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportCardsController],
      providers: [ReportCardsService],
    }).compile();

    controller = module.get<ReportCardsController>(ReportCardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
