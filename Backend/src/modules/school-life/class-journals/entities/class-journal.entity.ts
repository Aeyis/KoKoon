import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Class } from '../../../organization/classes/entities/class.entity';
import { Subject } from '../../../report-card/subjects/entities/subject.entity';

export enum JournalCategory {
  TODO = 'TODO',
  CORRECTION = 'CORRECTION',
  OUTING = 'OUTING',
  EVENT = 'EVENT',
  OTHER = 'OTHER',
}

@Entity()
export class ClassJournal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'int', nullable: true })
  period: number | null;

  @Column({ type: 'varchar', nullable: true })
  title: string | null;

  @Column({ type: 'varchar', nullable: true })
  color: string | null;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  done: boolean;

  @Column({ type: 'varchar', nullable: true })
  category: JournalCategory | null;

  @Column({ type: 'text', nullable: true })
  homework: string;

  @Column({ type: 'text', nullable: true })
  preparation: string;

  @ManyToOne(() => Class)
  classe: Class;

  @ManyToOne(() => Subject, { nullable: true })
  subject: Subject;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
