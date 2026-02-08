module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(.pnpm/.+/node_modules/)?(react-native|@react-native|@react-navigation|react-native-screens|react-native-safe-area-context|@reduxjs/toolkit|immer|redux|redux-thunk|react-redux|reselect|uuid)/)',
  ],
};
