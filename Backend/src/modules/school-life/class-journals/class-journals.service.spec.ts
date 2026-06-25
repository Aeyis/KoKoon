import { Test, TestingModule } from '@nestjs/testing';
import { ClassJournalsService } from './class-journals.service';

describe('ClassJournalsService', () => {
  let service: ClassJournalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassJournalsService],
    }).compile();

    service = module.get<ClassJournalsService>(ClassJournalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
