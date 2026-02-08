import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
  testID?: string;
}

export default function ErrorView({message, onRetry, testID}: ErrorViewProps) {
  return (
    <View style={styles.container} testID={testID || 'error-view'}>
      <Text style={styles.message} testID="error-message">{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry} testID="retry-button">
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
