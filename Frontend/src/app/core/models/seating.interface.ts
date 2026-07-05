export type DeskOrientation = 'H' | 'V';

export interface Desk {
  id: string;
  row: number;
  col: number;
  orientation: DeskOrientation;
  seats: (number | null)[];
}

export interface SeatingPlan {
  rows: number;
  cols: number;
  desks: Desk[];
}
