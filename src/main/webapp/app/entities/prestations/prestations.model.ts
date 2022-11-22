export interface IPrestations {
  id: string;
  label?: string | null;
  minutesDuration?: string | null;
  price?: number | null;
}

export type NewPrestations = Omit<IPrestations, 'id'> & { id: null };
