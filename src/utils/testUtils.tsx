import React, {ReactElement} from 'react';
import {render, RenderOptions} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import appointmentReducer from '../store/appointmentSlice';
import {doctorApi} from '../store/doctorApi';
import type {RootState} from '../store';

/**
 * Create a test Redux store with default configuration
 */
export const createTestStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      [doctorApi.reducerPath]: doctorApi.reducer,
      appointments: appointmentReducer,
    },
    preloadedState: preloadedState as RootState,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(doctorApi.middleware),
  });
};

export type AppStore = ReturnType<typeof createTestStore>;

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

/**
 * Custom render function that wraps components with Redux Provider
 * Usage:
 *   renderWithProviders(<MyComponent />)
 *   renderWithProviders(<MyComponent />, { preloadedState: { ... } })
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({children}: {children: React.ReactNode}) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {store, ...render(ui, {wrapper: Wrapper, ...renderOptions})};
}

export * from '@testing-library/react-native';
