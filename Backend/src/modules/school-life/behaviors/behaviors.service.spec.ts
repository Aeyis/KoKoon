import { Test, TestingModule } from '@nestjs/testing';
import { BehaviorsService } from './behaviors.service';

describe('BehaviorsService', () => {
  let service: BehaviorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BehaviorsService],
    }).compile();

    service = module.get<BehaviorsService>(BehaviorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
