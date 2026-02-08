import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {API_BASE_URL} from '../constants';
import type {Doctor} from '../types';
import {DoctorRaw} from '../types/api';
import {DAY_ORDER} from '../constants/schedule';

export const groupDoctors = (raw: DoctorRaw[]): Doctor[] => {
  const map = new Map<string, Doctor>();

  for (const item of raw) {
    let doctor = map.get(item.name);

    if (!doctor) {
      doctor = {
        id: item.name,
        name: item.name,
        timezone: item.timezone,
        schedules: [],
      };
      map.set(item.name, doctor);
    }

    doctor.schedules.push({
      dayOfWeek: item.day_of_week,
      availableAt: item.available_at.trim(),
      availableUntil: item.available_until.trim(),
    });
  }

  // Sort each doctor's schedules by day of week
  for (const doctor of map.values()) {
    doctor.schedules.sort(
      (a, b) => (DAY_ORDER[a.dayOfWeek] ?? 7) - (DAY_ORDER[b.dayOfWeek] ?? 7),
    );
  }

  return Array.from(map.values());
}

export const doctorApi = createApi({
  reducerPath: 'doctorApi',
  baseQuery: fetchBaseQuery({baseUrl: API_BASE_URL}),
  endpoints: builder => ({
    getDoctorRaw: builder.query<Doctor[], void>({
      query: () => '/suyogshiftcare/jsontest/main/available.json',
      transformResponse: (response: DoctorRaw[]) =>
        groupDoctors(response),
    }),
  }),
});

export const {useGetDoctorRawQuery} = doctorApi;
