import {
  Column,
  CreateDateColumn,
  Entity, ManyToOne, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {Class} from "../../classes/entities/class.entity";
import {MedicalRecord} from "../../medical-records/entities/medical-record.entity";

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ type: 'date' })
  birthDate: string;

  @Column({ nullable: true })
  photo: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(()=> Class, (classe)=> classe.students)
  classe: Class;

  @OneToOne(()=>MedicalRecord, (medicalRecord) => medicalRecord.student)
  medicalRecord: MedicalRecord;
}