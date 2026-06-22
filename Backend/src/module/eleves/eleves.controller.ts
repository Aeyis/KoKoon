import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ElevesService } from './eleves.service';
import { CreateEleveDto } from './dto/create-eleve.dto';
import { UpdateEleveDto } from './dto/update-eleve.dto';

@Controller('eleves')
export class ElevesController {
  constructor(private readonly elevesService: ElevesService) {}

  @Post()
  create(@Body() createEleveDto: CreateEleveDto) {
    return this.elevesService.create(createEleveDto);
  }

  @Get()
  findAll() {
    return this.elevesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.elevesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEleveDto: UpdateEleveDto) {
    return this.elevesService.update(+id, updateEleveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.elevesService.remove(+id);
  }
}
