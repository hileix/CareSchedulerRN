import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DoctorListScreen from './DoctorListScreen';
import { createTestStore } from '../utils/testUtils';
import type {
  RootStackParamList,
  MainTabParamList,
} from '../navigation/AppNavigator';
import type { Doctor } from '../types';

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
        availableUntil: '5:00PM',
      },
    ],
  },
  {
    id: 'doc2',
    name: 'Dr. Jane Doe',
    timezone: 'America/New_York',
    schedules: [
      {
        dayOfWeek: 'Tuesday',
        availableAt: '9:00AM',
        availableUntil: '5:00PM',
      },
    ],
  },
];

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const DoctorDetailPlaceholder = () => null;

const TestNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="MainTabs" component={TabNavigator} />
    <Stack.Screen name="DoctorDetail" component={DoctorDetailPlaceholder} />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="DoctorList" component={DoctorListScreen} />
  </Tab.Navigator>
);

const setup = () => {
  const store = createTestStore();

  return render(
    <Provider store={store}>
      <NavigationContainer>
        <TestNavigator />
      </NavigationContainer>
    </Provider>,
  );
};

describe('DoctorListScreen', () => {
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

    const { getByTestId } = setup();
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('shows error view when loading fails', () => {
    const refetch = jest.fn();

    mockUseGetDoctorRawQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch,
    });

    const {getByTestId} = setup();
    const errorView = getByTestId('error-view');
    expect(errorView).toBeTruthy();
    expect(getByTestId('error-message')).toHaveTextContent('Failed to load doctors.');
  });

  it('shows empty message when no doctors available', () => {
    mockUseGetDoctorRawQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    const {getByTestId} = setup();
    const emptyState = getByTestId('empty-state');
    expect(emptyState).toBeTruthy();
    expect(getByTestId('error-message')).toHaveTextContent('No doctors available.');
  });

  it('calls refetch when retry button is pressed', () => {
    const refetch = jest.fn();

    mockUseGetDoctorRawQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch,
    });

    const { getByText } = setup();
    fireEvent.press(getByText('Retry'));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('renders list of doctors with correct details', () => {
    mockUseGetDoctorRawQuery.mockReturnValue({
      data: mockDoctors,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    const { getAllByTestId } = setup();
    const doctorCards = getAllByTestId('doctor-card');
    expect(doctorCards).toHaveLength(2);

    const timezones = getAllByTestId('doctor-timezone');
    expect(timezones[0]).toHaveTextContent('Australia/Sydney');
    expect(timezones[1]).toHaveTextContent('America/New_York');
  });
});
