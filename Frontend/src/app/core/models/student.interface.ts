export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  photo: string | null;
  sex : 'MALE' | 'FEMALE' | null;
}

export interface MedicalRecord {
  allergies: string | null;
  diet: string | null;
  medicalConditions: string | null;
  emergencyContact: string | null;
}

export interface Guardian {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface StudentDetail extends Student {
  medicalRecord: MedicalRecord | null;
  guardians: Guardian[];
}
