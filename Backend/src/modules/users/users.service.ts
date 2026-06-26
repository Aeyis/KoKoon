import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User, ThemeMode} from "./entities/user.entity";
import {Repository} from "typeorm";
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import {MailService} from "../mail/mail.service";

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User)
      private readonly usersRepository: Repository<User>,
      private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto){
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // lien vaut 7 jours

    const user = this.usersRepository.create({
      ...createUserDto,
      password: null,
      invitationToken: hashedToken,
      invitationExpireAt: expiresAt,
    });
    await this.usersRepository.save(user);

    await this.mailService.sendInvitation(user.email, rawToken);

    return user;
  }

  findByEmail(email: string){
    return this.usersRepository.findOneBy({ email });
  }

  findByInvitationToken(hashedToken: string) {
    return this.usersRepository.findOneBy({ invitationToken: hashedToken });
  }

  async activateAccount(user: User, plainPassword: string) {
    user.password = await bcrypt.hash(plainPassword, 10);
    user.invitationToken = null;   // token usage unique puis on l'efface
    user.invitationExpireAt = null;
    return this.usersRepository.save(user);
  }

  updateTheme(id: number, theme: ThemeMode) {
    return this.usersRepository.update(id, { theme });
  }

  findAll() { return this.usersRepository.find(); }
  findOne(id: number) { return this.usersRepository.findOneBy({id}); }
  update(id: number, dto: UpdateUserDto){ return this.usersRepository.update(id, dto); }
  remove(id: number) { return this.usersRepository.delete(id); }
}
