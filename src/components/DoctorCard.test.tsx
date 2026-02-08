import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DoctorCard from './DoctorCard';
import type { Doctor } from '../types';

describe('<DoctorCard />', () => {
  const mockDoctor: Doctor = {
    id: 'doc1',
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
      {
        dayOfWeek: 'Wednesday',
        availableAt: '9:00AM',
        availableUntil: '5:00PM',
      },
    ],
  };

  it('matches snapshot', () => {
    const { toJSON } = render(
      <DoctorCard doctor={mockDoctor} onPress={jest.fn()} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders doctor information correctly', () => {
    const { getByTestId } = render(
      <DoctorCard doctor={mockDoctor} onPress={jest.fn()} />,
    );
    expect(getByTestId('doctor-name')).toHaveTextContent(mockDoctor.name);
    expect(getByTestId('doctor-timezone')).toHaveTextContent(mockDoctor.timezone);
    expect(getByTestId('available-days')).toHaveTextContent('Mon, Tue, Wed');
  });

  it('calls onPress when card is pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <DoctorCard doctor={mockDoctor} onPress={onPress} />,
    );
    fireEvent.press(getByTestId('doctor-card'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
