import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from './src/navigation/AppNavigator';

const AppContent = () => {
  return <AppNavigator />;
};

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
