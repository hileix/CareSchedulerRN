import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '../constants';
import type { Appointment } from '../types';

export const loadAppointments = async (): Promise<Appointment[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load appointments:', error);
    return [];
  }
};

export const saveAppointments = async (appointments: Appointment[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
};
