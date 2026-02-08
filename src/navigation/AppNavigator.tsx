import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DoctorListScreen from '../screens/DoctorListScreen';
import DoctorDetailScreen from '../screens/DoctorDetailScreen';
import MyAppointmentsScreen from '../screens/MyAppointmentsScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  DoctorDetail: { doctorId: string };
};

export type MainTabParamList = {
  DoctorList: undefined;
  AppointmentsTab: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen
        name="DoctorList"
        component={DoctorListScreen}
        options={{
          title: 'Doctors',
        }}
      />
      <Tab.Screen
        name="AppointmentsTab"
        component={MyAppointmentsScreen}
        options={{
          title: 'My Appointments',
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: true }}>
      <RootStack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="DoctorDetail"
        component={DoctorDetailScreen}
        options={{
          title: 'Available Slots',
          headerBackTitle: 'Doctors',
        }}
      />
    </RootStack.Navigator>
  );
};

export default AppNavigator;
