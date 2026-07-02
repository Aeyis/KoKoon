import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Class } from '../../../organization/classes/entities/class.entity';

export enum EventCategory {
  OUTING = 'OUTING',
  MEETING = 'MEETING',
  SCHOOL = 'SCHOOL',
  OTHER = 'OTHER',
}

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  title: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ default: false })
  allDay: boolean;

  @Column({ type: 'varchar', nullable: true })
  startTime: string | null;

  @Column({ type: 'varchar', nullable: true })
  endTime: string | null;

  @Column({ type: 'varchar', nullable: true })
  location: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', nullable: true })
  category: EventCategory | null;

  // null = événement de toute l'école ; sinon lié à une classe
  @ManyToOne(() => Class, { nullable: true })
  classe: Class | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
