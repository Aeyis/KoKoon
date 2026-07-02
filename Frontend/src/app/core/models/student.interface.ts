export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  photo: string | null;
  sex : 'MALE' | 'FEMALE' | null;
}
