import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User)
      private readonly usersRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto){
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({ ...createUserDto, password: hashedPassword });
    return this.usersRepository.save(user);
  }

  findByEmail(email: string){
    return this.usersRepository.findOneBy({ email });
  }

  findAll() { return this.usersRepository.find(); }
  findOne(id: number) { return this.usersRepository.findOneBy({id}); }
  update(id: number, dto: UpdateUserDto){ return this.usersRepository.update(id, dto); }
  remove(id: number) { return this.usersRepository.delete(id); }
}
