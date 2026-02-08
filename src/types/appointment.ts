export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  slotId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  timezone: string;
  bookedAt: string;
}

export interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
}
