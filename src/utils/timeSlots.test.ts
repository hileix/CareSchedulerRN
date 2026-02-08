import {parseTime, generateTimeSlots} from './timeSlots';
import type {WeeklySchedule} from '../types';
import dayjs from 'dayjs';

describe('parseTime()', () => {
  it('parses AM time correctly', () => {
    const result = parseTime('9:00AM');
    expect(result.isValid()).toBe(true);
    expect(result.hour()).toBe(9);
    expect(result.minute()).toBe(0);
  });

  it('parses PM time correctly', () => {
    const result = parseTime('5:30PM');
    expect(result.hour()).toBe(17);
    expect(result.minute()).toBe(30);
  });

  it('parses 12:00PM as noon', () => {
    const result = parseTime('12:00PM');
    expect(result.hour()).toBe(12);
  });

  it('parses 12:00AM as midnight', () => {
    const result = parseTime('12:00AM');
    expect(result.hour()).toBe(0);
  });

  it('returns invalid dayjs for invalid input', () => {
    expect(parseTime('invalid').isValid()).toBe(false);
    expect(parseTime('').isValid()).toBe(false);
  });
});

describe('generateTimeSlots()', () => {
  const doctorId = 'test-doctor';
  const doctorName = 'Dr. Test';
  const timezone = 'Australia/Sydney';

  function makeSchedule(
    day: string,
    from: string,
    until: string,
  ): WeeklySchedule {
    return {dayOfWeek: day, availableAt: from, availableUntil: until};
  }

  it('generates correct number of 30-min slots', () => {
    // 9:00AM - 10:30AM = 3 slots
    const schedule = makeSchedule('Monday', '9:00AM', '10:30AM');
    const slots = generateTimeSlots(doctorId, doctorName, timezone, schedule);
    expect(slots).toHaveLength(3);
    expect(slots[0].startTime).toBe('9:00AM');
    expect(slots[0].endTime).toBe('9:30AM');
    expect(slots[2].startTime).toBe('10:00AM');
    expect(slots[2].endTime).toBe('10:30AM');
  });

  it('generates correct slot ids', () => {
    const schedule = makeSchedule('Tuesday', '8:00AM', '9:00AM');
    const slots = generateTimeSlots(doctorId, doctorName, timezone, schedule);
    expect(slots[0].id).toBe('test-doctor_Tuesday_08:00');
    expect(slots[1].id).toBe('test-doctor_Tuesday_08:30');
  });

  it('returns empty when start equals end', () => {
    const schedule = makeSchedule('Monday', '9:00AM', '9:00AM');
    const slots = generateTimeSlots(doctorId, doctorName, timezone, schedule);
    expect(slots).toHaveLength(0);
  });

  it('returns empty when end is before start', () => {
    const schedule = makeSchedule('Monday', '5:00PM', '9:00AM');
    const slots = generateTimeSlots(doctorId, doctorName, timezone, schedule);
    expect(slots).toHaveLength(0);
  });

  it('returns empty for invalid time format', () => {
    const schedule = makeSchedule('Monday', 'bad', '9:00AM');
    const slots = generateTimeSlots(doctorId, doctorName, timezone, schedule);
    expect(slots).toHaveLength(0);
  });

  it('handles exactly 30 minutes window', () => {
    const schedule = makeSchedule('Friday', '1:00PM', '1:30PM');
    const slots = generateTimeSlots(doctorId, doctorName, timezone, schedule);
    expect(slots).toHaveLength(1);
    expect(slots[0].startTime).toBe('1:00PM');
    expect(slots[0].endTime).toBe('1:30PM');
  });

  it('preserves doctor metadata on each slot', () => {
    const schedule = makeSchedule('Wednesday', '8:00AM', '9:00AM');
    const slots = generateTimeSlots(doctorId, doctorName, timezone, schedule);
    for (const slot of slots) {
      expect(slot.doctorId).toBe(doctorId);
      expect(slot.doctorName).toBe(doctorName);
      expect(slot.timezone).toBe(timezone);
      expect(slot.dayOfWeek).toBe('Wednesday');
    }
  });
});
