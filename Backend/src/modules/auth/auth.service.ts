import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {LoginDto} from "./dto/login.dto";

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
}
