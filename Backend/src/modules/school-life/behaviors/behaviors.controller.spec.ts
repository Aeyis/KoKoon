import { Test, TestingModule } from '@nestjs/testing';
import { BehaviorsController } from './behaviors.controller';
import { BehaviorsService } from './behaviors.service';

describe('BehaviorsController', () => {
  let controller: BehaviorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BehaviorsController],
      providers: [BehaviorsService],
    }).compile();

    controller = module.get<BehaviorsController>(BehaviorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
