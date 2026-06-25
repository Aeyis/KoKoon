import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, Request } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Body() dto: CreateMessageDto, @Request() req) {
    return this.messageService.create(req.user.id, dto);
  }

  @Get('inbox')
  inbox(@Request() req) {
    return this.messageService.inbox(req.user.id);
  }

  @Get('sent')
  sent(@Request() req) {
    return this.messageService.sent(req.user.id);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.messageService.markAsRead(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}