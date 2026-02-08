import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {Doctor} from '../types';

interface DoctorCardProps {
  doctor: Doctor;
  onPress: () => void;
}

const DoctorCard = ({doctor, onPress}: DoctorCardProps) => {
  const daysText = doctor.schedules
    .map(s => s.dayOfWeek.slice(0, 3))
    .filter((v, i, a) => a.indexOf(v) === i)
    .join(', ');

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.name}>{doctor.name}</Text>
      <Text style={styles.timezone}>{doctor.timezone}</Text>
      <View style={styles.daysRow}>
        <Text style={styles.daysLabel}>Available: </Text>
        <Text style={styles.daysText}>{daysText}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DoctorCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  timezone: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  daysRow: {
    flexDirection: 'row',
  },
  daysLabel: {
    fontSize: 14,
    color: '#666',
  },
  daysText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
});
