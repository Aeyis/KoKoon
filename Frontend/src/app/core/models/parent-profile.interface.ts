export interface ParentProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
}

export interface UpdateParentProfile {
  phone?: string;
  address?: string;
}

export interface UpdateChildMedical {
  allergies?: string;
  diet?: string;
  medicalConditions?: string;
  emergencyContact?: string;
}
