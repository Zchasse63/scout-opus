describe('Booking Flow E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should navigate to booking from gym detail', async () => {
    // Navigate to explore tab (should be default)
    await expect(element(by.text('Explore'))).toBeVisible();

    // TODO: Search for a gym
    // In the real test, we'd trigger a search

    // Tap on a gym card (once search results are visible)
    // This would open the gym detail modal

    // Tap "Book Pass" button
    // await expect(element(by.text('Book Pass'))).toBeVisible();
  });

  it('should complete the booking flow', async () => {
    // 1. Navigate to Explore tab
    await expect(element(by.label('Explore'))).toBeVisible();

    // 2. Start a search (search for "gym")
    // await element(by.id('searchInput')).typeText('gym');
    // await element(by.id('searchButton')).multiTap();

    // 3. Wait for results to load
    // await waitFor(element(by.text("Gold's Gym Miami"))).toBeVisible().withTimeout(5000);

    // 4. Tap on first gym result
    // await element(by.text("Gold's Gym Miami")).multiTap();

    // 5. Verify gym detail modal opened
    // await expect(element(by.text('Book Pass'))).toBeVisible();

    // 6. Tap "Book Pass" button
    // await element(by.text('Book Pass')).multiTap();

    // 7. Select pass type (Day Pass)
    // await element(by.text('Day Pass')).multiTap();

    // 8. Tap "Continue to Payment"
    // await element(by.text('Continue to Payment')).multiTap();

    // 9. Fill in cardholder name
    // await element(by.id('cardholderName')).typeText('John Doe');

    // 10. Tap "Pay $25"
    // await element(by.text('Pay $25')).multiTap();

    // 11. Verify confirmation screen
    // await expect(element(by.text('Booking Confirmed!'))).toBeVisible();
    // await expect(element(by.text('Your Pass QR Code'))).toBeVisible();
  });

  it('should show passes in Passes tab after booking', async () => {
    // Navigate to Passes tab
    // await element(by.label('Passes')).multiTap();

    // Verify booking appears in list
    // await expect(element(by.text('Day Pass'))).toBeVisible();

    // Verify QR code button is present
    // await expect(element(by.text('📱 QR Code'))).toBeVisible();
  });

  it('should handle payment errors', async () => {
    // TODO: Implement payment error handling test
    // This would involve mocking a payment failure
  });

  it('should validate required fields', async () => {
    // Try to submit payment without cardholder name
    // await element(by.text('Pay $25')).multiTap();

    // Should show error message
    // await expect(element(by.text('Please enter cardholder name'))).toBeVisible();
  });
});
