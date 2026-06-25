import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Class} from "../../../organization/classes/entities/class.entity";
import {Subject} from "../../../report-card/subjects/entities/subject.entity";

@Entity()
export class ClassJournal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date'})
    date:string;

    @Column( { type: 'text' } )
    content: string;

    @Column( { type: 'text', nullable: true } )
    homework: string;

    @Column( { type: 'text', nullable: true } )
    preparation: string;

    @ManyToOne(()=>Class)
    classe: Class;

    @ManyToOne(()=> Subject, { nullable:true })
    subject: Subject;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
