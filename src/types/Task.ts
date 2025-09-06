export interface Task {
  _id: string;
  name: string;
  description?: string;
  color?: number;
  favorite?: boolean;
  complete?: boolean;
  startDate?: string;
  endDate?: string | null;
  __v?: number; // Campo opcional do MongoDB
}
