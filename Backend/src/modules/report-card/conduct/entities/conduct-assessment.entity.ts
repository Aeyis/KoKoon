import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from '../../../students/entities/student.entity';
import { Period } from '../../periods/entities/period.entity';
import { ConductItem } from './conduct-item.entity';

export enum ConductLevel {
  ACQUIRED = 'ACQUIRED',
  EVOLVING = 'EVOLVING',
  DIFFICULTY = 'DIFFICULTY',
}

@Entity()
@Unique(['student', 'item', 'period'])
export class ConductAssessment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  level: ConductLevel;

  @ManyToOne(() => Student)
  student: Student;

  @ManyToOne(() => ConductItem)
  item: ConductItem;

  @ManyToOne(() => Period)
  period: Period;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
