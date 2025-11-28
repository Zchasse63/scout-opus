import React from 'react';
import { render } from '@testing-library/react-native';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('should render with label', () => {
    const { getByText } = render(<Badge label="Test Badge" />);
    expect(getByText('Test Badge')).toBeTruthy();
  });

  it('should render with success variant', () => {
    const { getByText } = render(<Badge label="Success" variant="success" />);
    expect(getByText('Success')).toBeTruthy();
  });

  it('should render with error variant', () => {
    const { getByText } = render(<Badge label="Error" variant="error" />);
    expect(getByText('Error')).toBeTruthy();
  });

  it('should render with warning variant', () => {
    const { getByText } = render(<Badge label="Warning" variant="warning" />);
    expect(getByText('Warning')).toBeTruthy();
  });

  it('should render with info variant', () => {
    const { getByText } = render(<Badge label="Info" variant="info" />);
    expect(getByText('Info')).toBeTruthy();
  });

  it('should render with neutral variant', () => {
    const { getByText } = render(<Badge label="Neutral" variant="neutral" />);
    expect(getByText('Neutral')).toBeTruthy();
  });

  it('should render with verified variant', () => {
    const { getByText } = render(<Badge label="Verified" variant="verified" />);
    expect(getByText('Verified')).toBeTruthy();
  });

  it('should render with open variant', () => {
    const { getByText } = render(<Badge label="Open Now" variant="open" />);
    expect(getByText('Open Now')).toBeTruthy();
  });

  it('should render with small size', () => {
    const { getByText } = render(<Badge label="Small" size="small" />);
    expect(getByText('Small')).toBeTruthy();
  });

  it('should render with medium size (default)', () => {
    const { getByText } = render(<Badge label="Medium" />);
    expect(getByText('Medium')).toBeTruthy();
  });

  it('should render with small size', () => {
    const { getByText } = render(<Badge label="Small" size="small" />);
    expect(getByText('Small')).toBeTruthy();
  });

  it('should render with icon', () => {
    const MockIcon = () => null;
    const { getByText } = render(<Badge label="With Icon" icon={<MockIcon />} />);
    expect(getByText('With Icon')).toBeTruthy();
  });
});
