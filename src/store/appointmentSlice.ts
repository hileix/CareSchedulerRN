import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';
import { loadAppointments, saveAppointments } from '../services/storage';
import type { Appointment, AppointmentState, TimeSlot } from '../types';

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
};

/**
 * Book a new appointment for a time slot.
 * Validates that the slot hasn't been booked already before creating the appointment.
 */
export const bookAppointmentThunk = createAsyncThunk<
  Appointment,
  TimeSlot,
  { state: { appointments: AppointmentState }; rejectValue: string }
>('appointments/book', async (slot, { getState, rejectWithValue }) => {
  const { appointments } = getState().appointments;
  const duplicate = appointments.find(a => a.slotId === slot.id);
  if (duplicate) {
    return rejectWithValue('This time slot has already been booked.');
  }

  const appointment: Appointment = {
    id: nanoid(),
    doctorId: slot.doctorId,
    doctorName: slot.doctorName,
    slotId: slot.id,
    dayOfWeek: slot.dayOfWeek,
    startTime: slot.startTime,
    endTime: slot.endTime,
    timezone: slot.timezone,
    bookedAt: new Date().toISOString(),
  };

  const updated = [...appointments, appointment];
  await saveAppointments(updated);
  return appointment;
});

export const cancelAppointmentThunk = createAsyncThunk<
  string,
  string,
  { state: { appointments: AppointmentState } }
>('appointments/cancel', async (appointmentId, { getState }) => {
  const { appointments } = getState().appointments;
  const updated = appointments.filter(a => a.id !== appointmentId);
  await saveAppointments(updated);
  return appointmentId;
});

export const loadAppointmentsThunk = createAsyncThunk(
  'appointments/load',
  async () => {
    return await loadAppointments();
  },
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(bookAppointmentThunk.fulfilled, (state, action) => {
        state.appointments.push(action.payload);
      })
      .addCase(cancelAppointmentThunk.fulfilled, (state, action) => {
        state.appointments = state.appointments.filter(
          a => a.id !== action.payload,
        );
      })
      .addCase(loadAppointmentsThunk.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppointmentsThunk.fulfilled, (state, action) => {
        state.appointments = action.payload;
        state.loading = false;
      })
      .addCase(loadAppointmentsThunk.rejected, state => {
        state.loading = false;
      });
  },
});

export default appointmentSlice.reducer;
