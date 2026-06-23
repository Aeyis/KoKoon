import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn} from "typeorm";
import {Student} from "../../students/entities/student.entity";

export enum AttendanceSession { MORNING = 'MORNING', AFTERNOON = 'AFTERNOON' }
export enum AttendanceStatus { PRESENT= 'PRESENT', ABSENT = 'ABSENT', LATE='LATE' }

@Entity()
@Unique(['student', 'date', 'session'])
export class Attendance {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    date: string;

    @Column({ type:'enum', enum: AttendanceSession })
    session: AttendanceSession;

    @Column({ type: 'enum', enum: AttendanceStatus, default: AttendanceStatus.PRESENT })
    status: AttendanceStatus;

    @Column({ nullable: true })
    justification: string;

    @ManyToOne(()=> Student )
    student: Student;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
