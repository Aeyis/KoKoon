import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Student } from '../../../students/entities/student.entity';
import { Period } from '../../periods/entities/period.entity';

export enum ReportCardStatus { DRAFT = 'DRAFT', VALIDATED= 'VALIDATED', PUBLISHED = 'PUBLISHED', SIGNED = 'SIGNED' }

@Entity()
@Unique(['student', 'period'])
export class ReportCard {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: true })
    comment: string;

    @Column({ type: 'enum', enum: ReportCardStatus, default: ReportCardStatus.DRAFT })
    status: ReportCardStatus;

    @Column({ nullable: true })
    signature: string;

    @Column({ type: 'date', nullable: true })
    dueDate: string;

    @ManyToOne(() => Student)
    student: Student;

    @ManyToOne(() => Period)
    period: Period;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}