import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface TimeSlotItemProps {
  startTime: string;
  endTime: string;
  isBooked: boolean;
  onPress: () => void;
}

const TimeSlotItem = ({
  startTime,
  endTime,
  isBooked,
  onPress,
}: TimeSlotItemProps) => {
  return (
    <TouchableOpacity
      style={[styles.slot, isBooked && styles.slotBooked]}
      onPress={onPress}
      disabled={isBooked}
    >
      <Text style={[styles.time, isBooked && styles.timeBooked]}>
        {startTime} - {endTime}
      </Text>
      {isBooked && <Text style={styles.bookedLabel}>Booked</Text>}
    </TouchableOpacity>
  );
};

export default TimeSlotItem;

const styles = StyleSheet.create({
  slot: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    margin: 4,
    alignItems: 'center',
    minWidth: 110,
  },
  slotBooked: {
    backgroundColor: '#EEEEEE',
  },
  time: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2E7D32',
  },
  timeBooked: {
    color: '#999',
  },
  bookedLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
});
