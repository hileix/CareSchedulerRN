import {configureStore} from '@reduxjs/toolkit';
import {doctorApi} from './doctorApi';
import appointmentReducer from './appointmentSlice';

export const store = configureStore({
  reducer: {
    [doctorApi.reducerPath]: doctorApi.reducer,
    appointments: appointmentReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(doctorApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
