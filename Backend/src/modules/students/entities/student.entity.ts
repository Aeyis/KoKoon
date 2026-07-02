import {
  Column,
  CreateDateColumn,
  Entity, ManyToMany, ManyToOne, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {Class} from "../../organization/classes/entities/class.entity";
import {MedicalRecord} from "../../school-life/medical-records/entities/medical-record.entity";
import {User} from "../../users/entities/user.entity";

export enum Sex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ type: 'varchar', nullable: true })
  sex: Sex|null;

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

  @ManyToMany(()=>User, (user)=>user.children)
  guardians: User[];
}