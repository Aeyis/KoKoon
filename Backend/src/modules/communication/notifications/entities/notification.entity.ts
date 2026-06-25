import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../../users/entities/user.entity";

export enum NotificationType { ABSENCE = 'ABSENCE', MESSAGE = 'MESSAGE', REPORT_CARD = 'REPORT_CARD', GENERAL = 'GENERAL' };

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type:'enum', enum: NotificationType, default: NotificationType.GENERAL })
    type: NotificationType;

    @Column({ type: 'text' })
    content: string;

    @Column({ default: false })
    isRead: boolean;

    @ManyToOne(()=> User)
    recipient: User;

    @CreateDateColumn()
    createdAt: Date;

}
