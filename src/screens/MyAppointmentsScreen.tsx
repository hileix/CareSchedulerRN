import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import type {RootState, AppDispatch} from '../store';
import {cancelAppointmentThunk} from '../store/appointmentSlice';
import type {Appointment} from '../types';
import AppointmentCard from '../components/AppointmentCard';

const MyAppointmentsScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {appointments} = useSelector(
    (state: RootState) => state.appointments,
  );

  const handleCancel = (id: string) => {
    dispatch(cancelAppointmentThunk(id));
  };

  const renderItem = ({item}: {item: Appointment}) => (
    <AppointmentCard
      doctorName={item.doctorName}
      dayOfWeek={item.dayOfWeek}
      startTime={item.startTime}
      endTime={item.endTime}
      timezone={item.timezone}
      onCancel={() => handleCancel(item.id)}
    />
  );

  if (appointments.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No appointments yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

export default MyAppointmentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  list: {
    paddingVertical: 8,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
