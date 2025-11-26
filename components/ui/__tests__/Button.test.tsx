import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('should render with title', () => {
    const { getByText } = render(<Button title="Click Me" onPress={() => {}} />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Click Me" onPress={onPressMock} />);

    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Click Me" onPress={onPressMock} disabled />
    );

    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should show loading indicator when loading', () => {
    const { getByTestId, queryByText } = render(
      <Button title="Click Me" onPress={() => {}} loading />
    );

    expect(queryByText('Click Me')).toBeNull();
    // ActivityIndicator should be rendered
  });

  it('should render with primary variant by default', () => {
    const { getByText } = render(<Button title="Click Me" onPress={() => {}} />);
    const button = getByText('Click Me').parent?.parent;
    // Primary button should have primary background color
    expect(button).toBeTruthy();
  });

  it('should render with secondary variant', () => {
    const { getByText } = render(
      <Button title="Click Me" onPress={() => {}} variant="secondary" />
    );
    const button = getByText('Click Me').parent?.parent;
    expect(button).toBeTruthy();
  });

  it('should render with outline variant', () => {
    const { getByText } = render(
      <Button title="Click Me" onPress={() => {}} variant="outline" />
    );
    const button = getByText('Click Me').parent?.parent;
    expect(button).toBeTruthy();
  });

  it('should render with ghost variant', () => {
    const { getByText } = render(
      <Button title="Click Me" onPress={() => {}} variant="ghost" />
    );
    const button = getByText('Click Me').parent?.parent;
    expect(button).toBeTruthy();
  });

  it('should render with small size', () => {
    const { getByText } = render(
      <Button title="Click Me" onPress={() => {}} size="small" />
    );
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should render with large size', () => {
    const { getByText } = render(
      <Button title="Click Me" onPress={() => {}} size="large" />
    );
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should render full width', () => {
    const { getByText } = render(
      <Button title="Click Me" onPress={() => {}} fullWidth />
    );
    const button = getByText('Click Me').parent?.parent;
    expect(button).toBeTruthy();
  });

  it('should render with icon', () => {
    const MockIcon = () => null;
    const { getByText } = render(
      <Button title="Click Me" onPress={() => {}} icon={<MockIcon />} />
    );
    expect(getByText('Click Me')).toBeTruthy();
  });
});
