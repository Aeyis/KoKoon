import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
    @IsOptional()
    @IsEnum(NotificationType)
    type?: NotificationType;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsInt()
    recipientId: number;
}