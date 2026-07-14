import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {In, IsNull, Repository} from "typeorm";
import {Student} from "./entities/student.entity";
import {Class} from "../organization/classes/entities/class.entity";
import {School} from "../organization/schools/entities/school.entity";
import {User, UserRole} from "../users/entities/user.entity";
import {UsersService} from "../users/users.service";
import {InviteGuardianDto} from "./dto/invite-guardian.dto";


@Injectable()
export class StudentsService {
  constructor(
      @InjectRepository(Student)
      private readonly studentRepository: Repository<Student>,
      private readonly usersService: UsersService,
  ) {}
  create(createStudentDto: CreateStudentDto) {
    const { classId, schoolId, ...rest } = createStudentDto;
    const student = this.studentRepository.create({
      ...rest,
      classe: classId ? ({ id: classId } as Class) : null,
      school: schoolId ? ({ id: schoolId } as School) : null,
    });
    return this.studentRepository.save(student);
  }

  // Vivier d'élèves non affectés à une classe, limité à des écoles données
  // (null = toutes les écoles, pour un admin).
  findAvailable(schoolIds: number[] | null) {
    const where: Record<string, unknown> = { classe: IsNull() };
    if (schoolIds !== null) {
      if (!schoolIds.length) return Promise.resolve([]);
      where.school = { id: In(schoolIds) };
    }
    return this.studentRepository.find({ where, relations: { school: true } });
  }

  async assignClass(studentId: number, classId: number | null | undefined) {
    const student = await this.studentRepository.findOneBy({ id: studentId });
    if (!student) throw new NotFoundException('Student not found');
    student.classe = classId ? ({ id: classId } as Class) : null;
    await this.studentRepository.save(student);
    return this.findOne(studentId);
  }

  findAll(classIds: number[] | null = null) {
    if (classIds === null) {
      return this.studentRepository.find({ relations: { classe: true, school: true, guardians: true } });
    }
    return this.studentRepository.find({
      where: { classe: { id: In(classIds) } },
      relations: { classe: true, school: true, guardians: true },
    });
  }

  async findOne(id: number) {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: { classe: true, school: true, medicalRecord: true, guardians: true },
    });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return this.studentRepository.update(id, updateStudentDto);
  }

  remove(id: number) {
    return this.studentRepository.delete(id);
  }

  async addGuardian(studentId: number, userId: number) {
    try {
      await this.studentRepository.manager
          .createQueryBuilder()
          .relation(User, 'children')
          .of(userId)
          .add(studentId);
    } catch (e: any) {
      // relation déjà existante → idempotent, on ignore
      if (e.code !== '23505') throw e;
    }
    return this.studentRepository.findOne({
      where: { id: studentId },
      relations: { guardians: true },
    });
  }

  // Invite (ou relie) un parent à un élève. Renvoie le lien d'onboarding
  // pour les nouveaux comptes (pas de SMTP branché pour l'instant).
  async inviteGuardian(studentId: number, dto: InviteGuardianDto) {
    let user = await this.usersService.findByEmail(dto.email);
    let invitationLink: string | null = null;

    if (!user) {
      const res = await this.usersService.invite({
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: UserRole.RESPONSABLE,
      });
      user = res.user;
      invitationLink = res.invitationLink;
    }

    await this.addGuardian(studentId, user.id);

    return {
      guardian: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      invitationLink,
      alreadyExisted: invitationLink === null,
    };
  }
}