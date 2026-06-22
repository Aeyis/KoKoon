import { Test, TestingModule } from '@nestjs/testing';
import { ElevesService } from './eleves.service';

describe('ElevesService', () => {
  let service: ElevesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElevesService],
    }).compile();

    service = module.get<ElevesService>(ElevesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
