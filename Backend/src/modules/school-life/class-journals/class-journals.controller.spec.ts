import { Test, TestingModule } from '@nestjs/testing';
import { ClassJournalsController } from './class-journals.controller';
import { ClassJournalsService } from './class-journals.service';

describe('ClassJournalsController', () => {
  let controller: ClassJournalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassJournalsController],
      providers: [ClassJournalsService],
    }).compile();

    controller = module.get<ClassJournalsController>(ClassJournalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
