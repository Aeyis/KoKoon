import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Student} from "../../../students/entities/student.entity";


@Entity()
export class MedicalRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'text', nullable:true})
    allergies: string;

    @Column({type:'text', nullable:true})
    diet: string;

    @Column({type:'text', nullable:true})
    medicalConditions: string;

    @Column({type:'text'})
    emergencyContact: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(()=>Student, (student) => student.medicalRecord)
    @JoinColumn()
    student: Student;
}
