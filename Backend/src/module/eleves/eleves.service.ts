import { Injectable } from '@nestjs/common';
import { CreateEleveDto } from './dto/create-eleve.dto';
import { UpdateEleveDto } from './dto/update-eleve.dto';

@Injectable()
export class ElevesService {
  create(createEleveDto: CreateEleveDto) {
    return 'This action adds a new eleve';
  }

  findAll() {
    return `This action returns all eleves`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eleve`;
  }

  update(id: number, updateEleveDto: UpdateEleveDto) {
    return `This action updates a #${id} eleve`;
  }

  remove(id: number) {
    return `This action removes a #${id} eleve`;
  }
}
