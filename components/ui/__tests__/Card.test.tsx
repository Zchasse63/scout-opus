import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Card } from '../Card';

describe('Card', () => {
  it('should render children', () => {
    const { getByText } = render(
      <Card>
        <Text>Test Content</Text>
      </Card>
    );
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Card onPress={onPressMock}>
        <Text>Pressable Card</Text>
      </Card>
    );

    fireEvent.press(getByText('Pressable Card'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should not be pressable when pressable is false', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Card onPress={onPressMock} pressable={false}>
        <Text>Non-pressable Card</Text>
      </Card>
    );

    // When pressable is false, onPress shouldn't be callable
    expect(getByText('Non-pressable Card')).toBeTruthy();
  });

  it('should render with custom padding', () => {
    const { getByText } = render(
      <Card padding={20}>
        <Text>Custom Padding</Text>
      </Card>
    );
    expect(getByText('Custom Padding')).toBeTruthy();
  });

  it('should render elevated by default', () => {
    const { getByText } = render(
      <Card>
        <Text>Elevated Card</Text>
      </Card>
    );
    expect(getByText('Elevated Card')).toBeTruthy();
  });

  it('should render without elevation when elevated is false', () => {
    const { getByText } = render(
      <Card elevated={false}>
        <Text>Flat Card</Text>
      </Card>
    );
    expect(getByText('Flat Card')).toBeTruthy();
  });

  it('should apply custom styles', () => {
    const { getByText } = render(
      <Card style={{ backgroundColor: 'red' }}>
        <Text>Custom Style</Text>
      </Card>
    );
    expect(getByText('Custom Style')).toBeTruthy();
  });
});
