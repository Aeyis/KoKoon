import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ConductItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  label: string;

  @Column({ type: 'int', default: 0 })
  position: number;
}
