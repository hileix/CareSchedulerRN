import appointmentReducer, {
  bookAppointmentThunk,
  cancelAppointmentThunk,
  loadAppointmentsThunk,
} from './appointmentSlice';
import type {AppointmentState, TimeSlot} from '../types';
import {loadAppointments, saveAppointments} from '../services/storage';

jest.mock('../services/storage', () => ({
  loadAppointments: jest.fn().mockResolvedValue([]),
  saveAppointments: jest.fn().mockResolvedValue(undefined),
}));

const mockLoadAppointments = loadAppointments as jest.MockedFunction<
  typeof loadAppointments
>;
const mockSaveAppointments = saveAppointments as jest.MockedFunction<
  typeof saveAppointments
>;

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
};

describe('appointmentSlice reducer', () => {
  it('returns initial state', () => {
    const state = appointmentReducer(undefined, {type: ''});
    expect(state).toEqual(initialState);
  });

  it('sets loading on loadAppointments pending', () => {
    const state = appointmentReducer(
      initialState,
      loadAppointmentsThunk.pending(''),
    );
    expect(state.loading).toBe(true);
  });

  it('loads appointments on fulfilled', () => {
    const appointments = [
      {
        id: 'a1',
        doctorId: 'doc1',
        doctorName: 'Dr. Test',
        slotId: 'doc1_Monday_09:00',
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '09:30',
        timezone: 'Australia/Sydney',
        bookedAt: '2025-01-01T00:00:00.000Z',
      },
    ];
    const state = appointmentReducer(
      {...initialState, loading: true},
      loadAppointmentsThunk.fulfilled(appointments, ''),
    );
    expect(state.loading).toBe(false);
    expect(state.appointments).toEqual(appointments);
  });

  it('clears loading on loadAppointments rejected', () => {
    const state = appointmentReducer(
      {...initialState, loading: true},
      loadAppointmentsThunk.rejected(null, ''),
    );
    expect(state.loading).toBe(false);
  });

  it('adds appointment on bookAppointment fulfilled', () => {
    const appointment = {
      id: 'a1',
      doctorId: 'doc1',
      doctorName: 'Dr. Test',
      slotId: 'doc1_Monday_09:00',
      dayOfWeek: 'Monday',
      startTime: '09:00',
      endTime: '09:30',
      timezone: 'Australia/Sydney',
      bookedAt: '2025-01-01T00:00:00.000Z',
    };
    const state = appointmentReducer(
      initialState,
      bookAppointmentThunk.fulfilled(appointment, '', {} as TimeSlot),
    );
    expect(state.appointments).toHaveLength(1);
    expect(state.appointments[0]).toEqual(appointment);
  });

  it('removes appointment on cancelAppointment fulfilled', () => {
    const appointment = {
      id: 'a1',
      doctorId: 'doc1',
      doctorName: 'Dr. Test',
      slotId: 'doc1_Monday_09:00',
      dayOfWeek: 'Monday',
      startTime: '09:00',
      endTime: '09:30',
      timezone: 'Australia/Sydney',
      bookedAt: '2025-01-01T00:00:00.000Z',
    };
    const state = appointmentReducer(
      {...initialState, appointments: [appointment]},
      cancelAppointmentThunk.fulfilled('a1', '', 'a1'),
    );
    expect(state.appointments).toHaveLength(0);
  });
});

describe('appointmentSlice thunks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadAppointmentsThunk', () => {
    it('loads appointments from storage', async () => {
      const appointments = [
        {
          id: 'a1',
          doctorId: 'doc1',
          doctorName: 'Dr. Test',
          slotId: 'doc1_Monday_09:00',
          dayOfWeek: 'Monday',
          startTime: '09:00',
          endTime: '09:30',
          timezone: 'Australia/Sydney',
          bookedAt: '2025-01-01T00:00:00.000Z',
        },
      ];
      mockLoadAppointments.mockResolvedValueOnce(appointments);

      const dispatch = jest.fn();
      const getState = jest.fn();
      const thunk = loadAppointmentsThunk();
      const result = await thunk(dispatch, getState, undefined);

      expect(mockLoadAppointments).toHaveBeenCalledTimes(1);
      expect(result.payload).toEqual(appointments);
    });

    it('handles empty appointments', async () => {
      mockLoadAppointments.mockResolvedValueOnce([]);

      const dispatch = jest.fn();
      const getState = jest.fn();
      const thunk = loadAppointmentsThunk();
      const result = await thunk(dispatch, getState, undefined);

      expect(result.payload).toEqual([]);
    });
  });

  describe('bookAppointmentThunk', () => {
    const mockSlot: TimeSlot = {
      id: 'doc1_Monday_09:00',
      doctorId: 'doc1',
      doctorName: 'Dr. Test',
      dayOfWeek: 'Monday',
      startTime: '09:00',
      endTime: '09:30',
      timezone: 'Australia/Sydney',
    };

    it('books a new appointment successfully', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn(() => ({
        appointments: {appointments: [], loading: false},
      }));

      const thunk = bookAppointmentThunk(mockSlot);
      const result = await thunk(dispatch, getState, undefined);

      expect(result.type).toBe('appointments/book/fulfilled');
      expect(result.payload).toMatchObject({
        doctorId: 'doc1',
        doctorName: 'Dr. Test',
        slotId: 'doc1_Monday_09:00',
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '09:30',
        timezone: 'Australia/Sydney',
      });
      expect(result.payload).toHaveProperty('id');
      expect(result.payload).toHaveProperty('bookedAt');
      expect(mockSaveAppointments).toHaveBeenCalledTimes(1);
    });

    it('rejects booking duplicate slot', async () => {
      const existingAppointment = {
        id: 'a1',
        doctorId: 'doc1',
        doctorName: 'Dr. Test',
        slotId: 'doc1_Monday_09:00',
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '09:30',
        timezone: 'Australia/Sydney',
        bookedAt: '2025-01-01T00:00:00.000Z',
      };

      const dispatch = jest.fn();
      const getState = jest.fn(() => ({
        appointments: {appointments: [existingAppointment], loading: false},
      }));

      const thunk = bookAppointmentThunk(mockSlot);
      const result = await thunk(dispatch, getState, undefined);

      expect(result.type).toBe('appointments/book/rejected');
      expect(result.payload).toBe('This time slot has already been booked.');
      expect(mockSaveAppointments).not.toHaveBeenCalled();
    });

    it('saves appointments to storage', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn(() => ({
        appointments: {appointments: [], loading: false},
      }));

      const thunk = bookAppointmentThunk(mockSlot);
      await thunk(dispatch, getState, undefined);

      expect(mockSaveAppointments).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            slotId: 'doc1_Monday_09:00',
          }),
        ]),
      );
    });
  });

  describe('cancelAppointmentThunk', () => {
    it('cancels an appointment successfully', async () => {
      const appointment = {
        id: 'a1',
        doctorId: 'doc1',
        doctorName: 'Dr. Test',
        slotId: 'doc1_Monday_09:00',
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '09:30',
        timezone: 'Australia/Sydney',
        bookedAt: '2025-01-01T00:00:00.000Z',
      };

      const dispatch = jest.fn();
      const getState = jest.fn(() => ({
        appointments: {appointments: [appointment], loading: false},
      }));

      const thunk = cancelAppointmentThunk('a1');
      const result = await thunk(dispatch, getState, undefined);

      expect(result.type).toBe('appointments/cancel/fulfilled');
      expect(result.payload).toBe('a1');
      expect(mockSaveAppointments).toHaveBeenCalledWith([]);
    });

    it('handles canceling non-existent appointment', async () => {
      const appointment = {
        id: 'a1',
        doctorId: 'doc1',
        doctorName: 'Dr. Test',
        slotId: 'doc1_Monday_09:00',
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '09:30',
        timezone: 'Australia/Sydney',
        bookedAt: '2025-01-01T00:00:00.000Z',
      };

      const dispatch = jest.fn();
      const getState = jest.fn(() => ({
        appointments: {appointments: [appointment], loading: false},
      }));

      const thunk = cancelAppointmentThunk('non-existent');
      const result = await thunk(dispatch, getState, undefined);

      expect(result.type).toBe('appointments/cancel/fulfilled');
      expect(mockSaveAppointments).toHaveBeenCalledWith([appointment]);
    });

    it('saves updated appointments to storage', async () => {
      const appointments = [
        {
          id: 'a1',
          doctorId: 'doc1',
          doctorName: 'Dr. Test',
          slotId: 'doc1_Monday_09:00',
          dayOfWeek: 'Monday',
          startTime: '09:00',
          endTime: '09:30',
          timezone: 'Australia/Sydney',
          bookedAt: '2025-01-01T00:00:00.000Z',
        },
        {
          id: 'a2',
          doctorId: 'doc2',
          doctorName: 'Dr. Another',
          slotId: 'doc2_Tuesday_10:00',
          dayOfWeek: 'Tuesday',
          startTime: '10:00',
          endTime: '10:30',
          timezone: 'Australia/Sydney',
          bookedAt: '2025-01-02T00:00:00.000Z',
        },
      ];

      const dispatch = jest.fn();
      const getState = jest.fn(() => ({
        appointments: {appointments, loading: false},
      }));

      const thunk = cancelAppointmentThunk('a1');
      await thunk(dispatch, getState, undefined);

      expect(mockSaveAppointments).toHaveBeenCalledWith([appointments[1]]);
    });
  });
});
