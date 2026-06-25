import { PartialType } from '@nestjs/mapped-types';
import { CreateClassTeacherDto } from './create-class-teacher.dto';

export class UpdateClassTeacherDto extends PartialType(CreateClassTeacherDto) {}
