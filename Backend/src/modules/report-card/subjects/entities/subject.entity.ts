import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Subject {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 100 })
    name: string;
}
