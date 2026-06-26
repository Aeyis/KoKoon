import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { RolesGuards } from '../auth/guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateThemeDto } from './dto/update-theme.dto';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuards)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL)
  @Post()
  create(@Body() createUserDto: CreateUserDto, @Request() req) {
    // seul un ADMIN peut creer un compte ADMIN ou PRINCIPAL.Un PRINCIPAL ne peut creer que des roles TEACHER.
    if (req.user.role !== UserRole.ADMIN && createUserDto.role !== UserRole.TEACHER) {
      throw new ForbiddenException("You are not allowed to create an account with this role");
    }
    return this.usersService.create(createUserDto);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch('me/theme')
  updateMyTheme(@Request() req, @Body() dto: UpdateThemeDto) {
    return this.usersService.updateTheme(req.user.id, dto.theme);
  }

  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
