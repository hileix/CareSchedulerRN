import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadAppointments, saveAppointments} from './storage';
import {STORAGE_KEY} from '../constants';
import type {Appointment} from '../types';

const mockAppointment: Appointment = {
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

beforeEach(() => {
  (AsyncStorage.getItem as jest.Mock).mockReset();
  (AsyncStorage.setItem as jest.Mock).mockReset();
});

describe('loadAppointments()', () => {
  it('returns empty array when storage is empty', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    const result = await loadAppointments();
    expect(result).toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it('parses stored JSON correctly', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify([mockAppointment]),
    );
    const result = await loadAppointments();
    expect(result).toEqual([mockAppointment]);
  });

  it('returns empty array on storage error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
      new Error('Storage error'),
    );
    const result = await loadAppointments();
    expect(result).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to load appointments:',
      expect.any(Error),
    );
    consoleErrorSpy.mockRestore();
  });
});

describe('saveAppointments()', () => {
  it('saves appointments as JSON string', async () => {
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    await saveAppointments([mockAppointment]);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify([mockAppointment]),
    );
  });
});
