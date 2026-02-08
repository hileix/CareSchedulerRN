import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import {SLOT_DURATION_MINUTES} from '../constants';
import type {WeeklySchedule, TimeSlot} from '../types';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);

/**
 * Parse time string (e.g., "9:00AM") to dayjs object
 */
export function parseTime(timeStr: string): dayjs.Dayjs {
  return dayjs(timeStr.trim(), 'h:mmA');
}

/**
 * Generate 30-minute time slots based on doctor's schedule
 */
export function generateTimeSlots(
  doctorId: string,
  doctorName: string,
  timezone: string,
  schedule: WeeklySchedule,
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  let startTime: dayjs.Dayjs;
  let endTime: dayjs.Dayjs;

  try {
    startTime = parseTime(schedule.availableAt);
    endTime = parseTime(schedule.availableUntil);
  } catch {
    return slots;
  }

  if (!startTime.isValid() || !endTime.isValid() || endTime.isBefore(startTime)) {
    return slots;
  }

  let current = startTime;
  while (current.add(SLOT_DURATION_MINUTES, 'minute').isSameOrBefore(endTime)) {
    const slotEnd = current.add(SLOT_DURATION_MINUTES, 'minute');

    slots.push({
      id: `${doctorId}_${schedule.dayOfWeek}_${current.format('HH:mm')}`,
      doctorId,
      doctorName,
      dayOfWeek: schedule.dayOfWeek,
      startTime: current.format('h:mmA'),
      endTime: slotEnd.format('h:mmA'),
      timezone,
    });

    current = slotEnd;
  }

  return slots;
}
