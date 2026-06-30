import { UserRole} from '@core/enums/user-role.enum';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  theme:'LIGHT' | 'DARK' | null;
}
