import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "../../students/entities/student.entity";

@Entity()
export class Class {
    @PrimaryGeneratedColumn()
    id: number;

    @Column( {length:100} )
    name: string;

    @Column( {length:100} )
    schoolYear: string;

    @OneToMany(()=> Student, (student)=> student.classe)
    students: Student[];
}

