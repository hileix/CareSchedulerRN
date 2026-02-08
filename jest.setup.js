/* eslint-env jest */
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import {Alert} from 'react-native';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock Alert globally
jest.spyOn(Alert, 'alert').mockImplementation(() => {});
