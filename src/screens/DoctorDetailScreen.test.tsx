import React from 'react';
import {render, cleanup} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DoctorDetailScreen from './DoctorDetailScreen';
import {createTestStore} from '../utils/testUtils';
import type {RootStackParamList} from '../navigation/AppNavigator';
import type {Doctor} from '../types';

jest.mock('../services/storage', () => ({
  loadAppointments: jest.fn().mockResolvedValue([]),
  saveAppointments: jest.fn().mockResolvedValue(undefined),
}));

const mockUseGetDoctorRawQuery = jest.fn();

jest.mock('../store/doctorApi', () => ({
  ...jest.requireActual('../store/doctorApi'),
  useGetDoctorRawQuery: () => mockUseGetDoctorRawQuery(),
}));

const mockDoctors: Doctor[] = [
  {
    id: 'doc1',
    name: 'Dr. John Smith',
    timezone: 'Australia/Sydney',
    schedules: [
      {
        dayOfWeek: 'Monday',
        availableAt: '9:00AM',
        availableUntil: '10:00AM',
      },
      {
        dayOfWeek: 'Tuesday',
        availableAt: '9:00AM',
        availableUntil: '10:00AM',
      },
    ],
  },
];

const Stack = createNativeStackNavigator<RootStackParamList>();

const setup = (doctorId?: string) => {
  const store = createTestStore();

  return render(
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="DoctorDetail"
            component={DoctorDetailScreen}
            initialParams={{doctorId}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>,
  );
};

describe('<DoctorDetailScreen />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('shows loading view initially', () => {
    mockUseGetDoctorRawQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: jest.fn(),
    });

    const {getByTestId} = setup('doc1');
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('shows error when doctor not found', () => {
    mockUseGetDoctorRawQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    const {getByTestId} = setup();
    expect(getByTestId('error-view')).toBeTruthy();
  });

  it('renders doctor information when loaded', () => {
    mockUseGetDoctorRawQuery.mockReturnValue({
      data: mockDoctors,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    const {getByTestId} = setup('doc1');
    expect(getByTestId('doctor-name')).toHaveTextContent('Dr. John Smith');
    expect(getByTestId('doctor-timezone')).toHaveTextContent('Australia/Sydney');
  });

  it('renders schedule sections', () => {
    mockUseGetDoctorRawQuery.mockReturnValue({
      data: mockDoctors,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    const {getByTestId} = setup('doc1');
    expect(getByTestId('section-title-Monday')).toHaveTextContent('Monday');
    expect(getByTestId('section-title-Tuesday')).toHaveTextContent('Tuesday');
  });
});
