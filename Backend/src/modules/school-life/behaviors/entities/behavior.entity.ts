import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Student} from "../../../students/entities/student.entity";

export enum BehaviorType {POSITIVE = 'POSITIVE', MIDDLE='MIDDLE', NEGATIVE = 'NEGATIVE'}
@Entity()
export class Behavior {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: BehaviorType })
    type: BehaviorType;

    @Column({ length: 150})
    reason: string;

    @Column({ type: 'text', nullable: true })
    comment: string;

    @Column({ type:'date' })
    date: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(()=> Student)
    student: Student;
}
