import {
    Column,
    CreateDateColumn,
    Entity, JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Exclude} from "class-transformer";
import {Student} from "../../students/entities/student.entity";
import {School} from "../../organization/schools/entities/school.entity";

export enum UserRole {
    ADMIN = 'ADMIN',
    PRINCIPAL = 'PRINCIPAL',
    TEACHER = 'TEACHER',
    RESPONSABLE = 'RESPONSABLE',
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

    @ManyToMany(()=>Student, (student)=>student.guardians)
    @JoinTable()
    children: Student[];

    @ManyToMany(()=>School, (school)=>school.staff)
    @JoinTable()
    schools: School[];
}