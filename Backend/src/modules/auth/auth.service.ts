import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {JwtService} from "@nestjs/jwt";
import {LoginDto} from "./dto/login.dto";
import { BadRequestException } from '@nestjs/common';
import { AcceptInvitationDto} from "./dto/accept-invitation.dto";


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}
    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user || !user.password || !(await bcrypt.compare(loginDto.password, user.password))) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        return { access_token: await this.jwtService.signAsync(payload) };
    }

    async acceptInvitation(dto: AcceptInvitationDto) {
        const hashedToken = crypto.createHash('sha256').update(dto.password).digest('hex');
        const user = await this.usersService.findByInvitationToken(hashedToken);

        if (!user || !user.invitationExpireAt || user.invitationExpireAt < new Date()) {
            throw new BadRequestException('Invalid token');
        }
        await this.usersService.activateAccount(user, dto.password);

        const payload = { sub: user.id, email: user.email, role: user.role };
        return { access_token: await this.jwtService.signAsync(payload) };
    }
}
