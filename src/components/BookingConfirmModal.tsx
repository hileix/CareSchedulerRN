import React, {useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import type {AppDispatch} from '../store';
import {bookAppointmentThunk} from '../store/appointmentSlice';
import type {TimeSlot} from '../types';

interface BookingConfirmModalProps {
  visible: boolean;
  slot: TimeSlot | null;
  onClose: () => void;
}

const BookingConfirmModal = ({
  visible,
  slot,
  onClose,
}: BookingConfirmModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!slot) {
      return;
    }

    setSubmitting(true);
    try {
      const result = await dispatch(bookAppointmentThunk(slot)).unwrap();
      if (result) {
        Alert.alert('Success', 'Appointment booked successfully.', [
          {text: 'OK', onPress: onClose},
        ]);
      }
    } catch (err) {
      const message =
        typeof err === 'string' ? err : 'Failed to book appointment.';
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!slot) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      testID="booking-modal">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title} testID="modal-title">Confirm Booking</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} testID="close-button">
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Doctor</Text>
            <Text style={styles.value} testID="doctor-name">{slot.doctorName}</Text>

            <Text style={styles.label}>Day</Text>
            <Text style={styles.value} testID="day-of-week">{slot.dayOfWeek}</Text>

            <Text style={styles.label}>Time</Text>
            <Text style={styles.value} testID="time-slot">
              {slot.startTime} - {slot.endTime}
            </Text>

            <Text style={styles.label}>Timezone</Text>
            <Text style={styles.value} testID="timezone">{slot.timezone}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={submitting}
              testID="cancel-button">
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton, submitting && styles.buttonDisabled]}
              onPress={handleConfirm}
              disabled={submitting}
              testID="confirm-button">
              <Text style={styles.confirmButtonText}>
                {submitting ? 'Booking...' : 'Confirm'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default BookingConfirmModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 24,
    color: '#888',
  },
  card: {
    padding: 20,
  },
  label: {
    fontSize: 13,
    color: '#888',
    marginTop: 12,
    marginBottom: 2,
  },
  value: {
    fontSize: 17,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
