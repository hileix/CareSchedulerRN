import React, {useMemo, useState} from 'react';
import {SectionList, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {useGetDoctorRawQuery} from '../store/doctorApi';
import {generateTimeSlots} from '../utils/timeSlots';
import type {RootStackParamList} from '../navigation/AppNavigator';
import type {RootState} from '../store';
import type {TimeSlot} from '../types';
import TimeSlotItem from '../components/TimeSlotItem';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';
import BookingConfirmModal from '../components/BookingConfirmModal';

type Props = NativeStackScreenProps<RootStackParamList, 'DoctorDetail'>;

const DoctorDetailScreen = ({route}: Props) => {
  const {doctorId} = route.params;
  const {data: doctors, isLoading} = useGetDoctorRawQuery();
  const appointments = useSelector(
    (state: RootState) => state.appointments.appointments,
  );
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const doctor = useMemo(
    () => doctors?.find(d => d.id === doctorId),
    [doctors, doctorId],
  );

  const bookedSlotIds = useMemo(
    () => new Set(appointments.map(a => a.slotId)),
    [appointments],
  );

  const sections = useMemo(() => {
    if (!doctor) {
      return [];
    }

    return doctor.schedules.map(schedule => {
      const slots = generateTimeSlots(
        doctor.id,
        doctor.name,
        doctor.timezone,
        schedule,
      );
      return {
        title: schedule.dayOfWeek,
        subtitle: `${schedule.availableAt} - ${schedule.availableUntil}`,
        data: slots,
      };
    });
  }, [doctor]);

  if (isLoading) {
    return <LoadingView />;
  }

  if (!doctor) {
    return <ErrorView message="Doctor not found." />;
  }

  const renderSlot = ({item}: {item: TimeSlot}) => (
    <TimeSlotItem
      startTime={item.startTime}
      endTime={item.endTime}
      isBooked={bookedSlotIds.has(item.id)}
      onPress={() => setSelectedSlot(item)}
    />
  );

  return (
    <View style={styles.container} testID="doctor-detail-container">
      <View style={styles.header} testID="doctor-header">
        <Text style={styles.name} testID="doctor-name">{doctor.name}</Text>
        <Text style={styles.timezone} testID="doctor-timezone">{doctor.timezone}</Text>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={renderSlot}
        renderSectionHeader={({section}) => (
          <View style={styles.sectionHeader} testID={`section-${section.title}`}>
            <Text style={styles.sectionTitle} testID={`section-title-${section.title}`}>{section.title}</Text>
            <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled
      />
      <BookingConfirmModal
        visible={selectedSlot !== null}
        slot={selectedSlot}
        onClose={() => setSelectedSlot(null)}
      />
    </View>
  );
};

export default DoctorDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  timezone: {
    fontSize: 14,
    color: '#888',
  },
  list: {
    paddingBottom: 16,
  },
  sectionHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
});
