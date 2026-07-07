export interface Period {
  n: number;
  label: string;
  time: string;
  half: 'AM' | 'PM';
}

export const PERIODS: Period[] = [
  { n: 1, label: 'P1', time: '08:30', half: 'AM' },
  { n: 2, label: 'P2', time: '09:20', half: 'AM' },
  { n: 3, label: 'P3', time: '10:25', half: 'AM' },
  { n: 4, label: 'P4', time: '11:15', half: 'AM' },
  { n: 5, label: 'P5', time: '13:15', half: 'PM' },
  { n: 6, label: 'P6', time: '14:05', half: 'PM' },
];
