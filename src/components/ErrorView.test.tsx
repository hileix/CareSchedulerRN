import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import ErrorView from './ErrorView';

describe('<ErrorView />', () => {
  const errorMessage = 'Test error';

  it('matches snapshot with retry button', () => {
    const onRetry = jest.fn();
    const {toJSON} = render(
      <ErrorView message="Test error" onRetry={onRetry} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('matches snapshot without retry button', () => {
    const {toJSON} = render(<ErrorView message="Test error" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders error message', () => {
    const {getByTestId} = render(<ErrorView message={errorMessage} />);
    expect(getByTestId('error-message')).toHaveTextContent(errorMessage);
  });

  it('handles retry button visibility and interaction', () => {
    // Without retry
    const {queryByTestId} = render(<ErrorView message={errorMessage} />);
    expect(queryByTestId('retry-button')).toBeNull();

    // With retry
    const onRetry = jest.fn();
    const {getByTestId} = render(
      <ErrorView message={errorMessage} onRetry={onRetry} />,
    );
    expect(getByTestId('retry-button')).toBeTruthy();

    fireEvent.press(getByTestId('retry-button'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
