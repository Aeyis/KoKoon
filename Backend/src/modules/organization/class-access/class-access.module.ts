import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ClassTeacher} from "../class-teachers/entities/class-teacher.entity";
import {Substitution} from "../substitutions/entities/substitution.entity";
import {Student} from "../../students/entities/student.entity";
import {ClassAccessService} from "./class-access.service";

@Module({
    imports: [TypeOrmModule.forFeature([ClassTeacher, Substitution, Student])],
    providers: [ClassAccessService],
    exports: [ClassAccessService],
})
export class ClassAccessModule {}