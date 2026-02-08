import React from 'react';
import {render, fireEvent, cleanup, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {Alert} from 'react-native';
import MyAppointmentsScreen from './MyAppointmentsScreen';
import {createTestStore} from '../utils/testUtils';
import type {Appointment} from '../types';

jest.mock('../store/doctorApi', () => ({
  doctorApi: {
    reducerPath: 'doctorApi',
    reducer: (state = {}) => state,
    middleware: [],
  },
  useGetDoctorRawQuery: jest.fn(),
}));

jest.mock('../services/storage', () => ({
  loadAppointments: jest.fn().mockResolvedValue([]),
  saveAppointments: jest.fn().mockResolvedValue(undefined),
}));

const mockSaveAppointments = require('../services/storage').saveAppointments;

// Mock Alert.alert to automatically confirm
jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
  if (buttons && buttons.length > 1) {
    // Call the onPress of the second button (Cancel Appointment)
    const cancelButton = buttons[1];
    if (cancelButton.onPress) {
      cancelButton.onPress();
    }
  }
});

const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    doctorId: 'doc1',
    doctorName: 'Dr. John Smith',
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
    doctorName: 'Dr. Jane Doe',
    slotId: 'doc2_Tuesday_10:00',
    dayOfWeek: 'Tuesday',
    startTime: '10:00',
    endTime: '10:30',
    timezone: 'America/New_York',
    bookedAt: '2025-01-02T00:00:00.000Z',
  },
];

const setup = (appointments: Appointment[] = []) => {
  const store = createTestStore({
    appointments: {
      appointments,
      loading: false,
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <NavigationContainer>
          <MyAppointmentsScreen />
        </NavigationContainer>
      </Provider>,
    ),
  };
};

describe('<MyAppointmentsScreen />', () => {
  beforeEach(() => {
    mockSaveAppointments.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('shows empty state when no appointments', () => {
    const {getByTestId} = setup([]);
    expect(getByTestId('empty-state')).toBeTruthy();
  });

  it('displays appointment details correctly', () => {
    const {getAllByTestId} = setup(mockAppointments);
    const doctorNames = getAllByTestId('doctor-name');
    const appointmentTimes = getAllByTestId('appointment-time');
    const timezones = getAllByTestId('timezone');

    expect(doctorNames).toHaveLength(2);
    expect(appointmentTimes).toHaveLength(2);
    expect(timezones).toHaveLength(2);

    // Verify first appointment details
    expect(doctorNames[0]).toHaveTextContent('Dr. John Smith');
    expect(appointmentTimes[0]).toHaveTextContent('Monday 09:00 - 09:30');
    expect(timezones[0]).toHaveTextContent('Australia/Sydney');

    // Verify second appointment details
    expect(doctorNames[1]).toHaveTextContent('Dr. Jane Doe');
    expect(appointmentTimes[1]).toHaveTextContent('Tuesday 10:00 - 10:30');
    expect(timezones[1]).toHaveTextContent('America/New_York');
  });

  it('removes appointment when cancel button is pressed', async () => {
    const {getAllByTestId, store} = setup(mockAppointments);

    // Initially should have 2 appointments
    expect(getAllByTestId('appointment-card')).toHaveLength(2);

    // Press the first cancel button
    const cancelButtons = getAllByTestId('cancel-button');
    fireEvent.press(cancelButtons[0]);

    // Wait for the async action to complete
    await waitFor(() => {
      expect(mockSaveAppointments).toHaveBeenCalled();
    });

    // Verify the correct appointment was removed from store
    const state = store.getState();
    expect(state.appointments.appointments).toHaveLength(1);
    expect(state.appointments.appointments[0].id).toBe('a2');
    expect(state.appointments.appointments[0].doctorName).toBe('Dr. Jane Doe');

    // Verify saveAppointments was called with the updated list
    expect(mockSaveAppointments).toHaveBeenCalledWith([mockAppointments[1]]);
  });
});
