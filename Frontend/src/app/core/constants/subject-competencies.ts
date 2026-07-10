export type Scale = 'numeric' | 'letter';

export interface SubjectSpec {
  scale: Scale;
  competencies: string[];
}

export const SUBJECT_COMPETENCIES: Record<string, SubjectSpec> = {
  French: {
    scale: 'numeric',
    competencies: [
      'Oral & technical reading',
      'Spelling',
      'Grammar & conjugation',
      'Expression & vocabulary',
      'Writing',
    ],
  },
  Maths: {
    scale: 'numeric',
    competencies: ['Numbers & operations', 'Measurement', 'Solids & figures', 'Data handling'],
  },
  English: {
    scale: 'letter',
    competencies: ['English'],
  },
  PE: {
    scale: 'letter',
    competencies: ['Physical education', 'Swimming'],
  },
  'Philosophy & Citizenship': {
    scale: 'letter',
    competencies: ['Philosophy & Citizenship'],
  },
  'Philosophical course': {
    scale: 'letter',
    competencies: ['Philosophical course'],
  },
};

export const LETTER_GRADES = ['TB', 'B', 'S', 'F'];
