import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../users/entities/user.entity";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: 'text'})
    content: string;

    @Column({ default: false})
    isRead: boolean;

    @ManyToOne(() => User)
    sender: User;

    @ManyToOne(() => User)
    recipient: User;

    @CreateDateColumn()
    createdAt: Date;

}
