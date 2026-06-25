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

    @Column( { type: 'float' })
    score: number;

    @Column({ type: 'float' })
    maxScore: number;

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
