import { PartialType } from '@nestjs/mapped-types';
import { CreateClassJournalDto } from './create-class-journal.dto';

export class UpdateClassJournalDto extends PartialType(CreateClassJournalDto) {}
