import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../../users/entities/user.entity";
import {Class} from "../../classes/entities/class.entity";

@Entity()
export class Substitution {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    substitute: User;

    @ManyToOne(() => Class)
    classe: Class;

    @Column({ type: 'date' })
    startDate: string;

    @Column({ type: 'date' })
    endDate: string;

}
