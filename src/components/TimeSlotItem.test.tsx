import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TimeSlotItem from './TimeSlotItem';

describe('<TimeSlotItem />', () => {
  const defaultProps = {
    startTime: '09:00',
    endTime: '09:30',
    isBooked: false,
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot for available slot', () => {
    const { toJSON } = render(<TimeSlotItem {...defaultProps} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('matches snapshot for booked slot', () => {
    const { toJSON } = render(<TimeSlotItem {...defaultProps} isBooked />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders time slot with correct text', () => {
    const { getByTestId } = render(<TimeSlotItem {...defaultProps} />);
    expect(getByTestId('time-slot-text')).toHaveTextContent(
      `${defaultProps.startTime} - ${defaultProps.endTime}`,
    );
  });

  it('handles booked state correctly', () => {
    const { getByTestId } = render(<TimeSlotItem {...defaultProps} isBooked />);
    expect(getByTestId('booked-label')).toHaveTextContent('Booked');

    const { queryByTestId: queryAvailable } = render(
      <TimeSlotItem {...defaultProps} isBooked={false} />,
    );
    expect(queryAvailable('booked-label')).toBeNull();
  });

  it('handles press events based on booked state', () => {
    const onPress = jest.fn();

    // Available slot - should call onPress
    const { getByTestId } = render(
      <TimeSlotItem {...defaultProps} onPress={onPress} />,
    );
    fireEvent.press(getByTestId('time-slot-item'));
    expect(onPress).toHaveBeenCalledTimes(1);

    // Booked slot - should not call onPress
    onPress.mockClear();
    const { getByTestId: getBookedSlot } = render(
      <TimeSlotItem {...defaultProps} isBooked onPress={onPress} />,
    );
    fireEvent.press(getBookedSlot('time-slot-item'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
