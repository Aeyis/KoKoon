import { Test, TestingModule } from '@nestjs/testing';
import { ElevesController } from './eleves.controller';
import { ElevesService } from './eleves.service';

describe('ElevesController', () => {
  let controller: ElevesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElevesController],
      providers: [ElevesService],
    }).compile();

    controller = module.get<ElevesController>(ElevesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
