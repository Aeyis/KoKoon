import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "../../../students/entities/student.entity";
import {School} from "../../schools/entities/school.entity";

export type DeskOrientation = 'H' | 'V';

export interface Desk {
    id:string;
    row: number;
    col: number;
    orientation: DeskOrientation;
    seats:(number|null) [];
}
export interface SeatingPlan {
    rows: number;
    cols: number;
    desks: Desk[];
}

@Entity()
export class Class {
    @PrimaryGeneratedColumn()
    id: number;

    @Column( {length:100} )
    name: string;

    @Column( {length:100} )
    schoolYear: string;

    @Column ({ type: 'jsonb', nullable:true }) //toute colonne typée X | null doit avoir un type: explicite, sinon Postgres plante. JSONb stocke l'objet et json et le charge au démarrage.
    seating:SeatingPlan|null;

    @OneToMany(()=> Student, (student)=> student.classe)
    students: Student[];

    @ManyToOne(()=> School, (school)=> school.classes, { nullable: true })
    school: School;
}

