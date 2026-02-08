import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch } from 'react-redux';
import { AppDispatch, store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { loadAppointmentsThunk } from './src/store/appointmentSlice';

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadAppointmentsThunk());
  }, [dispatch]);

  return <AppNavigator />;
}

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
