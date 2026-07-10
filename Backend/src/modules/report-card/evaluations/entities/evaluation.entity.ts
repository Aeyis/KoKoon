import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Student} from "../../../students/entities/student.entity";
import {Subject} from "../../subjects/entities/subject.entity";
import {Period} from "../../periods/entities/period.entity";


@Entity()
export class Evaluation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 150 })
    title: string;

    @Column({ type: 'varchar', nullable: true })
    competency: string | null;

    @Column({ type: 'float', nullable: true })
    score: number | null;

    @Column({ type: 'float', nullable: true })
    maxScore: number | null;

    @Column({ type: 'varchar', nullable: true })
    grade: string | null;

    @Column ({ type: 'date' })
    date: string;

    @ManyToOne(() => Student)
    student: Student;

    @ManyToOne(() => Subject)
    subject: Subject;

    @ManyToOne(()=> Period)
    period: Period;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
