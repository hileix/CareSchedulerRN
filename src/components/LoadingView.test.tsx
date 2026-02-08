import React from 'react';
import {render} from '@testing-library/react-native';
import LoadingView from './LoadingView';

describe('<LoadingView />', () => {
  it('matches snapshot', () => {
    const {toJSON} = render(<LoadingView />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders ActivityIndicator', () => {
    const {getByTestId} = render(<LoadingView />);
    const indicator = getByTestId('activity-indicator');
    expect(indicator).toBeTruthy();
  });
});
