import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "../../../students/entities/student.entity";
import {User} from "../../../users/entities/user.entity";
import {School} from "../../schools/entities/school.entity";

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

    @ManyToOne(()=> User, (user)=> user.classes)
    teacher: User;

    @ManyToOne(()=> School, (school)=> school.classes, { nullable: true })
    school: School;
}

