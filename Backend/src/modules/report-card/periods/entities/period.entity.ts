import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Period {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'date' })
    startDate: string;

    @Column({ type: 'date' })
    endDate: string;
}
