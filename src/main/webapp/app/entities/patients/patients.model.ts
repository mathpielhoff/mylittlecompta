export interface IPatients {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  age?: string | null;
  schoolClass?: string | null;
  school?: string | null;
}

export type NewPatients = Omit<IPatients, 'id'> & { id: null };
