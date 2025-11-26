import { device, element, by, expect as detoxExpect } from 'detox';

describe('Scout App E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show welcome screen on first launch', async () => {
    // This test assumes onboarding flow exists
    // Adjust based on actual implementation
    await detoxExpect(element(by.text('Welcome to Scout'))).toBeVisible();
  });

  it('should navigate to explore tab', async () => {
    // Tap on explore tab
    await element(by.id('explore-tab')).tap();
    // Verify we're on explore screen
    await detoxExpect(element(by.id('search-input'))).toBeVisible();
  });

  it('should navigate to passes tab', async () => {
    // Tap on passes tab
    await element(by.id('passes-tab')).tap();
    // Verify we're on passes screen
    await detoxExpect(element(by.text('Passes'))).toBeVisible();
  });

  it('should navigate to trips tab', async () => {
    // Tap on trips tab
    await element(by.id('trips-tab')).tap();
    // Verify we're on trips screen
    await detoxExpect(element(by.text('Trips'))).toBeVisible();
  });

  it('should navigate to profile tab', async () => {
    // Tap on profile tab
    await element(by.id('profile-tab')).tap();
    // Verify we're on profile screen
    await detoxExpect(element(by.text('Profile'))).toBeVisible();
  });

  it('should perform a search', async () => {
    // Navigate to explore
    await element(by.id('explore-tab')).tap();

    // Type in search box
    await element(by.id('search-input')).typeText('powerlifting gym');

    // Wait for results
    await waitFor(element(by.id('gym-list')))
      .toBeVisible()
      .withTimeout(5000);

    // Verify results are shown
    await detoxExpect(element(by.id('gym-list'))).toBeVisible();
  });

  it('should open gym details', async () => {
    // Navigate to explore
    await element(by.id('explore-tab')).tap();

    // Perform search
    await element(by.id('search-input')).typeText('gym');

    // Wait for results
    await waitFor(element(by.id('gym-list')))
      .toBeVisible()
      .withTimeout(5000);

    // Tap first gym
    await element(by.id('gym-card-0')).tap();

    // Verify gym details screen
    await detoxExpect(element(by.id('gym-details'))).toBeVisible();
  });

  it('should toggle map view', async () => {
    // Navigate to explore
    await element(by.id('explore-tab')).tap();

    // Tap map toggle
    await element(by.id('map-toggle')).tap();

    // Verify map is visible
    await detoxExpect(element(by.id('gym-map'))).toBeVisible();
  });
});
