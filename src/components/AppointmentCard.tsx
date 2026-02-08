import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AppointmentCardProps {
  doctorName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  timezone: string;
  onCancel: () => void;
}

const AppointmentCard = ({
  doctorName,
  dayOfWeek,
  startTime,
  endTime,
  timezone,
  onCancel,
}: AppointmentCardProps) => {
  const handleCancel = () => {
    Alert.alert(
      'Cancel Appointment',
      `Cancel appointment with ${doctorName} on ${dayOfWeek} ${startTime}-${endTime}?`,
      [
        { text: 'Keep', style: 'cancel' },
        { text: 'Cancel Appointment', style: 'destructive', onPress: onCancel },
      ],
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.doctor}>{doctorName}</Text>
        <Text style={styles.time}>
          {dayOfWeek} {startTime} - {endTime}
        </Text>
        <Text style={styles.timezone}>{timezone}</Text>
      </View>
      <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppointmentCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  info: {
    flex: 1,
  },
  doctor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  timezone: {
    fontSize: 12,
    color: '#888',
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  cancelText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '500',
  },
});
