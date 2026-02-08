# CareScheduler - Doctor Appointment Booking App

A React Native mobile application for browsing doctors and booking 30-minute appointment slots.

## Overview

CareScheduler allows users to:
- Browse a list of available doctors with their schedules
- View available 30-minute time slots for each doctor
- Book appointments with doctors
- View and manage their booked appointments
- All appointment data is persisted locally on the device

## Technology Stack

- **Framework**: React Native 0.83.1 (Bare workflow, not Expo)
- **Language**: TypeScript 5
- **State Management**: Redux Toolkit with RTK Query
- **Navigation**: React Navigation 7 (Bottom Tabs + Stack)
- **Storage**: AsyncStorage for local data persistence
- **Testing**: Jest + React Testing Library

## Project Structure

```
src/
├── types/                    # TypeScript type definitions
├── store/                    # Redux state management
│   ├── index.ts              # Store configuration
│   ├── doctorApi.ts          # RTK Query - Doctor data API
│   └── appointmentSlice.ts   # Appointment data slice
├── services/                 # Storage services
│   └── storage.ts            # AsyncStorage wrapper
├── utils/                    # Utility functions
│   ├── timeSlots.ts          # Time slot generation logic
│   └── timezone.ts           # Timezone handling
├── navigation/               # Navigation configuration
│   └── AppNavigator.tsx
├── screens/                  # Screen components
│   ├── DoctorListScreen.tsx
│   ├── DoctorDetailScreen.tsx
│   └── MyAppointmentsScreen.tsx
├── components/               # Reusable components
│   ├── DoctorCard.tsx
│   ├── TimeSlotItem.tsx
│   ├── AppointmentCard.tsx
│   ├── LoadingView.tsx
│   └── ErrorView.tsx
└── constants/                # App constants
    └── index.ts
```

## Installation

### Prerequisites

Make sure you have completed the [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment) guide.

### Install Dependencies

```bash
pnpm install
```

### iOS Setup

Install CocoaPods dependencies:

```bash
cd ios && pod install
```

### Android Setup
1. Open Android Studio and configure the Android SDK
2. Wait for the native libraries to be installed automatically

## Running the App

### Start Metro Bundler

```bash
pnpm start
```

### Run on iOS

```bash
pnpm ios
```

### Run on Android

```bash
pnpm android
```

## Key Design Decisions

### Time Slot Generation
- Generates 30-minute slots from doctor's available hours

### Timezone Handling
- All times displayed in doctor's local timezone
- Timezone clearly indicated in UI
- No cross-timezone conversion (simplifies implementation)

### Data Management
- **Doctor data**: Fetched from API, cached by RTK Query
- **Appointment data**: Stored locally in AsyncStorage
- **Duplicate prevention**: Checks for existing bookings before confirming

### Navigation Structure
- Bottom Tab Navigator with two tabs:
  - "Doctors" tab: Doctor list → Detail → Booking flow
  - "My Appointments" tab: View and manage bookings

## Testing

Run the test suite:

```bash
pnpm test
```

### Test Coverage

- **Unit Tests**: Time slot generation, timezone utilities, Redux slices
- **Component Tests**: Screen rendering, user interactions
- **Edge Cases**: Invalid time formats, insufficient time slots, duplicate bookings
- **Error Handling**: Network failures, storage errors

## Assumptions & Limitations

### Assumptions
1. User is already logged in (no authentication flow implemented)
2. Single user system - no multi-user appointment conflicts
3. Doctor names are unique (used as identifiers)
4. Schedules represent weekly recurring patterns (Monday to Sunday only, no specific dates)
5. All times displayed in doctor's timezone
6. Appointments stored locally only (no backend sync)

### Known Limitations
- No backend server - appointments only persist on local device
- Static weekly schedules (no support for date-specific changes)
- No offline queue for failed operations
- No push notifications for appointment reminders

## Future Improvements

- Calendar view mapping weekly schedules to specific dates
- Offline-first architecture with sync queue
- Push notifications for appointment reminders
- User timezone conversion support
- Doctor search and filtering
- Backend API integration for multi-device sync
- User authentication system
