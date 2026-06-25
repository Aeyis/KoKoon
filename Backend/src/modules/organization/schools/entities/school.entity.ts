import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Class} from "../../classes/entities/class.entity";
import {User} from "../../../users/entities/user.entity";

@Entity()
export class School {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    city: string;

    @Column()
    postalCode: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    email: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(()=> Class, (classe) => classe.school)
    classes: Class[];

    @ManyToMany(()=> User, (user)=>user.schools)
    staff: User[];
}
