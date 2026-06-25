import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {User} from "../../../users/entities/user.entity";
import {Class} from "../../classes/entities/class.entity";

export enum ClassRole {
    LEAD = 'LEAD',
    SUPPORT = 'SUPPORT',
}

@Entity()
@Unique(['teacher', 'classe'])
export class ClassTeacher {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    teacher: User;

    @ManyToOne(() => Class)
    classe: Class;

    @Column({ type: 'enum', enum: ClassRole })
    role: ClassRole;
}