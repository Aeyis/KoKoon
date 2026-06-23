import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Exclude} from "class-transformer";
import {Class} from "../../classes/entities/class.entity";

export enum UserRole {
    TEACHER = 'TEACHER',
    RESPONSABLE = 'RESPONSABLE',
    PRINCIPAL = 'PRINCIPAL',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Exclude()
    @Column()
    password: string;

    @Column({ type: 'enum', enum: UserRole })
    role: UserRole;

    @Column({ length: 255 })
    firstName: string;

    @Column({ length: 255 })
    lastName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Class, (classe) => classe.teacher)
    classes: Class[];
}