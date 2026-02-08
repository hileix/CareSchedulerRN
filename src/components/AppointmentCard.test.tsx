import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AppointmentCard from './AppointmentCard';

describe('<AppointmentCard />', () => {
  const defaultProps = {
    doctorName: 'Dr. John Smith',
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '09:30',
    timezone: 'Australia/Sydney',
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { toJSON } = render(<AppointmentCard {...defaultProps} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders appointment details', () => {
    const { getByTestId } = render(<AppointmentCard {...defaultProps} />);
    expect(getByTestId('doctor-name')).toHaveTextContent(defaultProps.doctorName);
    expect(getByTestId('appointment-time')).toHaveTextContent(
      `${defaultProps.dayOfWeek} ${defaultProps.startTime} - ${defaultProps.endTime}`,
    );
    expect(getByTestId('timezone')).toHaveTextContent(defaultProps.timezone);
  });

  it('renders cancel button', () => {
    const { getByTestId } = render(<AppointmentCard {...defaultProps} />);
    expect(getByTestId('cancel-button')).toBeTruthy();
  });

  it('shows confirmation alert when cancel is pressed', () => {
    const { getByTestId } = render(<AppointmentCard {...defaultProps} />);
    fireEvent.press(getByTestId('cancel-button'));
    expect(Alert.alert).toHaveBeenCalledWith(
      'Cancel Appointment',
      `Cancel appointment with ${defaultProps.doctorName} on ${defaultProps.dayOfWeek} ${defaultProps.startTime}-${defaultProps.endTime}?`,
      expect.arrayContaining([
        expect.objectContaining({ text: 'Keep', style: 'cancel' }),
        expect.objectContaining({
          text: 'Cancel Appointment',
          style: 'destructive',
        }),
      ]),
    );
  });

  it('calls onCancel when confirmed in alert', () => {
    const onCancel = jest.fn();
    const { getByTestId } = render(
      <AppointmentCard {...defaultProps} onCancel={onCancel} />,
    );
    fireEvent.press(getByTestId('cancel-button'));

    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const buttons = alertCall[2];
    const cancelButton = buttons.find(
      (b: any) => b.text === 'Cancel Appointment',
    );
    cancelButton.onPress();

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('does not call onCancel when keep is pressed in alert', () => {
    const onCancel = jest.fn();
    const { getByTestId } = render(
      <AppointmentCard {...defaultProps} onCancel={onCancel} />,
    );
    fireEvent.press(getByTestId('cancel-button'));

    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const buttons = alertCall[2];
    const keepButton = buttons.find((b: any) => b.text === 'Keep');
    if (keepButton.onPress) {
      keepButton.onPress();
    }

    expect(onCancel).not.toHaveBeenCalled();
  });
});
