import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ClassTeacher} from "../class-teachers/entities/class-teacher.entity";
import {LessThanOrEqual, MoreThanOrEqual, Repository} from "typeorm";
import {Substitution} from "../substitutions/entities/substitution.entity";
import {Student} from "../../students/entities/student.entity";
import {User, UserRole} from "../../users/entities/user.entity";

export interface AuthUser {
    id: number;
    role: UserRole;
}

@Injectable()
export class ClassAccessService {
    constructor(
        @InjectRepository(ClassTeacher)
        private readonly classTeacherRepository: Repository<ClassTeacher>,
        @InjectRepository(Substitution)
        private readonly substitutionRepository: Repository<Substitution>,
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    /** Resout la classe d'un eleve (pour les modules rattaches a un student). */
    async studentClassId(studentId: number): Promise<number | null> {
        const student = await this.studentRepository.findOne({
            where: { id: studentId },
            relations: { classe: true },
        });
        if (!student) throw new NotFoundException('Student not found');
        return student.classe?.id ?? null;
    }

    private today(): string {
        return new Date().toISOString().slice(0, 10);
    }

    /** Ecoles de l'utilisateur. ADMIN = null (toutes). PRINCIPAL/TEACHER = ses ecoles. */
    async accessibleSchoolIds(user: AuthUser): Promise<number[] | null> {
        if (user.role === UserRole.ADMIN) return null;
        if (user.role !== UserRole.PRINCIPAL && user.role !== UserRole.TEACHER) return [];
        const u = await this.userRepository.findOne({
            where: { id: user.id },
            relations: { schools: true },
        });
        return (u?.schools ?? []).map((s) => s.id);
    }

    /** Classes de toutes les ecoles de l'utilisateur (pour un PRINCIPAL). */
    private async classIdsOfUserSchools(userId: number): Promise<number[]> {
        const u = await this.userRepository.findOne({
            where: { id: userId },
            relations: { schools: { classes: true } },
        });
        const ids = new Set<number>();
        (u?.schools ?? []).forEach((s) => (s.classes ?? []).forEach((c) => ids.add(c.id)));
        return [...ids];
    }

    /** Cet utilisateur a-t-il acces a CETTE classe ? */
    async canAccess(user: AuthUser, classId: number | null | undefined): Promise<boolean> {
        if (user.role === UserRole.ADMIN) return true;
        if (!classId) return false;

        if (user.role === UserRole.PRINCIPAL) {
            const ids = await this.classIdsOfUserSchools(user.id);
            return ids.includes(classId);
        }

        if (user.role !== UserRole.TEACHER) return false;

        const asTitulaire = await this.classTeacherRepository.count({
            where: { teacher: { id: user.id }, classe: { id: classId } },
        });
        if (asTitulaire > 0) return true;

        const asSubstitute = await this.substitutionRepository.count({
            where: {
                substitute: { id: user.id },
                classe: { id: classId },
                startDate: LessThanOrEqual(this.today()),
                endDate: MoreThanOrEqual(this.today()),
            },
        });
        return asSubstitute > 0;
    }

    async accessibleClassIds(user: AuthUser): Promise<number[] | null> {
        if (user.role === UserRole.ADMIN) return null;

        if (user.role === UserRole.PRINCIPAL) {
            return this.classIdsOfUserSchools(user.id);
        }

        if (user.role !== UserRole.TEACHER) return [];

        const titulaires = await this.classTeacherRepository.find({
            where: { teacher: { id: user.id } },
            relations: { classe: true },
        });
        const subs = await this.substitutionRepository.find({
            where: {
                substitute: { id: user.id },
                startDate: LessThanOrEqual(this.today()),
                endDate: MoreThanOrEqual(this.today()),
            },
            relations: { classe: true },
        });

        const ids = new Set<number>();
        titulaires.forEach((ct) => ids.add(ct.classe.id));
        subs.forEach((s) => ids.add(s.classe.id));
        return [...ids];
    }
}