export interface WeeklySchedule {
  dayOfWeek: string;
  availableAt: string;
  availableUntil: string;
}

export interface Doctor {
  id: string;
  name: string;
  timezone: string;
  schedules: WeeklySchedule[];
}
