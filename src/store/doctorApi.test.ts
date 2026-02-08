import {groupDoctors} from './doctorApi';
import type {DoctorRaw} from '../types/api';

describe('doctorApi', () => {
  describe('groupDoctors()', () => {
    it('groups doctors by name', () => {
      const raw: DoctorRaw[] = [
        {
          name: 'Dr. John Smith',
          timezone: 'Australia/Sydney',
          day_of_week: 'Monday',
          available_at: '9:00AM',
          available_until: '5:00PM',
        },
        {
          name: 'Dr. John Smith',
          timezone: 'Australia/Sydney',
          day_of_week: 'Tuesday',
          available_at: '9:00AM',
          available_until: '5:00PM',
        },
      ];

      const result = groupDoctors(raw);
      expect(result).toEqual([
        {
          id: 'Dr. John Smith',
          name: 'Dr. John Smith',
          timezone: 'Australia/Sydney',
          schedules: [
            {
              dayOfWeek: 'Monday',
              availableAt: '9:00AM',
              availableUntil: '5:00PM',
            },
            {
              dayOfWeek: 'Tuesday',
              availableAt: '9:00AM',
              availableUntil: '5:00PM',
            },
          ],
        },
      ]);
    });

    it('creates separate doctors for different names', () => {
      const raw: DoctorRaw[] = [
        {
          name: 'Dr. John Smith',
          timezone: 'Australia/Sydney',
          day_of_week: 'Monday',
          available_at: '9:00AM',
          available_until: '5:00PM',
        },
        {
          name: 'Dr. Jane Doe',
          timezone: 'America/New_York',
          day_of_week: 'Monday',
          available_at: '9:00AM',
          available_until: '5:00PM',
        },
      ];

      const result = groupDoctors(raw);
      expect(result).toEqual([
        {
          id: 'Dr. John Smith',
          name: 'Dr. John Smith',
          timezone: 'Australia/Sydney',
          schedules: [
            {
              dayOfWeek: 'Monday',
              availableAt: '9:00AM',
              availableUntil: '5:00PM',
            },
          ],
        },
        {
          id: 'Dr. Jane Doe',
          name: 'Dr. Jane Doe',
          timezone: 'America/New_York',
          schedules: [
            {
              dayOfWeek: 'Monday',
              availableAt: '9:00AM',
              availableUntil: '5:00PM',
            },
          ],
        },
      ]);
    });

    it('trims whitespace from time strings', () => {
      const raw: DoctorRaw[] = [
        {
          name: 'Dr. John Smith',
          timezone: 'Australia/Sydney',
          day_of_week: 'Monday',
          available_at: ' 9:00AM ',
          available_until: ' 5:00PM ',
        },
      ];

      const result = groupDoctors(raw);
      expect(result[0].schedules[0].availableAt).toBe('9:00AM');
      expect(result[0].schedules[0].availableUntil).toBe('5:00PM');
    });

    it('sorts schedules by day of week', () => {
      const raw: DoctorRaw[] = [
        {
          name: 'Dr. John Smith',
          timezone: 'Australia/Sydney',
          day_of_week: 'Friday',
          available_at: '9:00AM',
          available_until: '5:00PM',
        },
        {
          name: 'Dr. John Smith',
          timezone: 'Australia/Sydney',
          day_of_week: 'Monday',
          available_at: '9:00AM',
          available_until: '5:00PM',
        },
        {
          name: 'Dr. John Smith',
          timezone: 'Australia/Sydney',
          day_of_week: 'Wednesday',
          available_at: '9:00AM',
          available_until: '5:00PM',
        },
      ];

      const result = groupDoctors(raw);
      expect(result[0].schedules[0].dayOfWeek).toBe('Monday');
      expect(result[0].schedules[1].dayOfWeek).toBe('Wednesday');
      expect(result[0].schedules[2].dayOfWeek).toBe('Friday');
    });

    it('handles empty array', () => {
      const result = groupDoctors([]);
      expect(result).toEqual([]);
    });
  });
});
