import React from 'react';
import {fireEvent, waitFor} from '@testing-library/react-native';
import BookingConfirmModal from './BookingConfirmModal';
import {renderWithProviders} from '../utils/testUtils';
import type {TimeSlot} from '../types';

jest.mock('../services/storage', () => ({
  loadAppointments: jest.fn().mockResolvedValue([]),
  saveAppointments: jest.fn().mockResolvedValue(undefined),
}));

const mockSlot: TimeSlot = {
  id: 'doc1_Monday_09:00',
  doctorId: 'doc1',
  doctorName: 'Dr. John Smith',
  dayOfWeek: 'Monday',
  startTime: '09:00',
  endTime: '09:30',
  timezone: 'Australia/Sydney',
};

describe('<BookingConfirmModal />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot', () => {
    const {toJSON} = renderWithProviders(
      <BookingConfirmModal
        visible={true}
        slot={mockSlot}
        onClose={jest.fn()}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders null when slot is null', () => {
    const {toJSON} = renderWithProviders(
      <BookingConfirmModal visible={true} slot={null} onClose={jest.fn()} />,
    );
    expect(toJSON()).toBeNull();
  });

  it('renders modal with slot information', () => {
    const {getByTestId} = renderWithProviders(
      <BookingConfirmModal
        visible={true}
        slot={mockSlot}
        onClose={jest.fn()}
      />,
    );
    expect(getByTestId('modal-title')).toHaveTextContent('Confirm Booking');
    expect(getByTestId('doctor-name')).toHaveTextContent(mockSlot.doctorName);
    expect(getByTestId('day-of-week')).toHaveTextContent(mockSlot.dayOfWeek);
    expect(getByTestId('time-slot')).toHaveTextContent(
      `${mockSlot.startTime} - ${mockSlot.endTime}`,
    );
    expect(getByTestId('timezone')).toHaveTextContent(mockSlot.timezone);
    expect(getByTestId('confirm-button')).toBeTruthy();
  });

  it('calls onClose when close or cancel button is pressed', () => {
    const onClose = jest.fn();
    const {getByTestId} = renderWithProviders(
      <BookingConfirmModal
        visible={true}
        slot={mockSlot}
        onClose={onClose}
      />,
    );

    fireEvent.press(getByTestId('close-button'));
    expect(onClose).toHaveBeenCalledTimes(1);

    onClose.mockClear();
    fireEvent.press(getByTestId('cancel-button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when submitting', async () => {
    const {getByTestId} = renderWithProviders(
      <BookingConfirmModal
        visible={true}
        slot={mockSlot}
        onClose={jest.fn()}
      />,
    );

    fireEvent.press(getByTestId('confirm-button'));
    await waitFor(() => {
      expect(getByTestId('confirm-button')).toHaveTextContent('Booking...');
    });
  });
});
