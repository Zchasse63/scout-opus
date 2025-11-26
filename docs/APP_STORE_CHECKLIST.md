# Scout App Store Submission Checklist

Use this checklist to prepare Scout for submission to the Apple App Store.

## Pre-Submission Requirements

### App Information
- [ ] App name: "Scout - Fitness Discovery"
- [ ] Subtitle: "Find gyms. Book passes. Travel fit."
- [ ] Keywords: fitness, gym, booking, travel, passes, workouts
- [ ] Description (160 characters max): "Discover and book gym passes while traveling"
- [ ] Full description (4000 characters max): See below

### Bundle ID and Team
- [ ] Bundle ID: `com.scoutfitness.app` (matching app.json)
- [ ] Team ID: [Your Apple Developer Team ID]
- [ ] App ID prefix: [Your Team ID prefix]

### Version and Build
- [ ] Version number: 1.0.0
- [ ] Build number: 1
- [ ] Both set in app.json and Xcode

### Category and Rating
- [ ] Category: Health & Fitness
- [ ] Content rating: 4+
- [ ] Copyright: © 2025 Scout Fitness, Inc.

## Screenshots and Media

### App Store Screenshots (Required)
Create 2-5 screenshots for each required device:
- [ ] iPhone 6.7" (iPhone 15 Pro Max)
- [ ] iPhone 6.1" (iPhone 15 Pro)
- [ ] iPhone 5.8" (iPhone 14 Pro)

**Recommended Screenshots** (in order):
1. Explore tab with gym list and search
2. Gym detail modal with photos and booking CTA
3. Booking flow (pass selection)
4. Passes tab with active booking and QR code
5. Trips tab with travel detection

**Specifications:**
- Format: PNG or JPEG
- Size: 1284 x 2778px (for 6.7" devices)
- No device frames (added by App Store)
- Text overlay recommended

### App Icon
- [ ] Icon file: 1024 x 1024px (PNG)
- [ ] Location in project: `assets/icon.png`
- [ ] Scout orange color with fitness dumbbell
- [ ] No transparency, solid background
- [ ] All rounded corners handled by App Store

### Preview Video (Optional)
- [ ] Duration: 15-30 seconds
- [ ] Format: MP4 or MOV
- [ ] Resolution: 1920 x 1440px
- [ ] Shows key features: search, booking, passes

## Privacy and Security

### Privacy Policy
- [ ] URL: https://scoutfitness.app/privacy
- [ ] Must cover:
  - Data collected (location, calendar, audio for voice search)
  - How data is used
  - Third-party services (Stripe, Google, OneSignal)
  - User rights and deletion

### Terms of Service
- [ ] URL: https://scoutfitness.app/terms
- [ ] Must cover:
  - User responsibilities
  - Booking terms (no refunds)
  - Liability limitations
  - Dispute resolution

### Permissions
Required permissions to declare:
- [ ] Camera: Not used initially (reserve for future QR scanning)
- [ ] Microphone: Voice search feature
- [ ] Calendar: Trip detection from calendar events
- [ ] Location: Map and nearby gyms
- [ ] Contacts: Not used

### Data & Privacy Questionnaire
- [ ] Data collection: Yes (location, calendar events, voice)
- [ ] Data sharing: Yes (Stripe, Google Places, OneSignal)
- [ ] Data deletion: User can request via settings
- [ ] Data retention: 30 days for location queries, permanent for bookings

### Authentication
- [ ] Apple Sign In: Yes, implemented
- [ ] Third-party auth: Google OAuth, Email magic links
- [ ] Privacy-preserving: All auth via Supabase

## Technical Requirements

### App Building

1. **Generate Signing Certificate**
   ```bash
   # In Xcode or via Apple Developer Portal
   # Create Development and Distribution certificates
   ```

2. **Create Provisioning Profiles**
   ```bash
   # Development profile for testing
   # App Store distribution profile for submission
   ```

3. **Build for Distribution**
   ```bash
   eas build --platform ios --profile release
   ```

### Code Quality
- [ ] No console.log statements (use proper logging)
- [ ] No hardcoded API keys or secrets
- [ ] All unused imports removed
- [ ] TypeScript strict mode: No `any` types
- [ ] Network calls use HTTPS only
- [ ] Error handling for all network requests

### Performance
- [ ] App launches in under 5 seconds
- [ ] No memory leaks detected
- [ ] Handles network failures gracefully
- [ ] Battery usage reasonable (no constant GPS)
- [ ] App doesn't drain data excessively

### Compatibility
- [ ] Minimum iOS version: 14.0
- [ ] Tested on iPhone 12, 13, 14, 15
- [ ] Safe area handled correctly
- [ ] Landscape mode disabled (portrait only)
- [ ] All text readable at minimum font size

## App Functionality Testing

### Critical User Flows
- [ ] Login with Apple works
- [ ] Login with Google works
- [ ] Login with Email/Magic Link works
- [ ] Search for gyms returns results
- [ ] Voice search records and transcribes
- [ ] Gym detail modal displays correctly
- [ ] Booking flow completes successfully
- [ ] QR code generates after booking
- [ ] Passes appear in Passes tab
- [ ] Calendar sync (if implemented) works
- [ ] Trip detection displays correct dates
- [ ] Logout clears session properly

### Edge Cases
- [ ] No network connection shows error
- [ ] Poor network connection handled gracefully
- [ ] Voice search timeout (if no response)
- [ ] Payment declined shows error message
- [ ] Location permission denied handled
- [ ] Calendar permission denied handled
- [ ] Large gym result lists scroll smoothly

### Accessibility
- [ ] VoiceOver works on all screens
- [ ] Text size adjusts with system font
- [ ] Color contrast meets WCAG AA
- [ ] All interactive elements have >44pt touch area
- [ ] No flashing content (accessibility concern)

## App Store Submission

### Pre-Submission Checklist
- [ ] Run final build and test on device
- [ ] Run type-check: `npm run type-check`
- [ ] Run lint: `npm run lint`
- [ ] Run tests: `npm test -- --coverage`
- [ ] Update version number (1.0.0 for initial release)
- [ ] Update build number (1 for first build)
- [ ] Verify all screenshots are correct size
- [ ] Verify app icon is correct (no App Store required text)

### App Store Connect Configuration

1. **App Information**
   - [ ] App name verified
   - [ ] Bundle ID verified
   - [ ] Category set (Health & Fitness)
   - [ ] Rating age set (4+)
   - [ ] Content rights confirmed

2. **Pricing and Availability**
   - [ ] Price tier: Free
   - [ ] Available in all regions
   - [ ] Launch date: Set or "Available immediately"

3. **Build**
   - [ ] Upload build from Xcode
   - [ ] Select build from Xcode Organizer
   - [ ] Build successfully processes

4. **App Review Information**
   - [ ] Notes: "Scout is a gym discovery and booking platform. Users can search for gyms, view details, and book day/week/month passes. Voice search powered by Apple SpeechAnalyzer and Gemini AI. Payments processed via Stripe."
   - [ ] Demo account: [Optional - may not be needed for gym search]
   - [ ] URL: https://scoutfitness.app
   - [ ] Contact email: support@scoutfitness.app
   - [ ] Test user account: (if needed)
   - [ ] Phone number: [Your contact number]

5. **Content Rights**
   - [ ] Confirm rights to all screenshots and artwork
   - [ ] Confirm rights to app name
   - [ ] Confirm rights to any third-party content

6. **Export Compliance**
   - [ ] Encryption used: Yes (HTTPS for all API calls)
   - [ ] Encryption details: Standard TLS 1.2+ for API communication

### Submit for Review
- [ ] Click "Submit for Review"
- [ ] Confirm submission
- [ ] Monitor review status in App Store Connect

## Post-Submission

### Review Process Expectations
- [ ] Timeline: 24-48 hours for initial review
- [ ] May be rejected for issues (address and resubmit)
- [ ] May request clarification on features

### Common Rejection Reasons to Avoid
- [ ] Incomplete app (broken features)
- [ ] Crashes on launch
- [ ] Poor performance
- [ ] Unclear privacy practices
- [ ] Misleading app description
- [ ] Issues with payment processing

### After Approval
- [ ] App becomes available immediately
- [ ] Monitor crash reports in Xcode
- [ ] Monitor user reviews and ratings
- [ ] Plan for version 1.0.1 patch release (if needed)
- [ ] Plan for version 1.1 feature release

## Version Release Notes Template

**For Version 1.0.0:**
```
🎉 Welcome to Scout!

Discover and book gym passes while traveling:

✨ Features:
• Search thousands of gyms with Google Places integration
• 🎤 Voice search: Just tell Scout what you need
• 📱 Apple Maps integration with gym locations
• 🎫 Easy 3-step booking process
• 📋 Manage your passes and QR codes
• ✈️ Automatic trip detection from your calendar
• 💳 Secure payments via Stripe

🚀 Ready to stay fit while you travel? Download Scout today!
```

## Support Contact Info

- Email: support@scoutfitness.app
- Website: https://scoutfitness.app
- Twitter: @ScoutFitness
- Discord: [Community Discord link]

## Final Verification

Before clicking submit:
- [ ] Version and build numbers correct
- [ ] All screenshots approved
- [ ] App icon approved
- [ ] Privacy policy URL is live and accessible
- [ ] Terms of service URL is live and accessible
- [ ] No test data in production build
- [ ] All API keys are production keys
- [ ] Crash reporting configured (Sentry or similar)
- [ ] Analytics configured (Amplitude or similar)

## Post-Launch Monitoring

### First 24 Hours
- [ ] Monitor App Store for crashes/reviews
- [ ] Check Sentry for error reports
- [ ] Verify payments are processing correctly
- [ ] Monitor server load and performance

### First 7 Days
- [ ] Collect user feedback from reviews
- [ ] Fix any critical bugs immediately
- [ ] Plan patches for common issues
- [ ] Prepare version 1.0.1 if needed

### First 30 Days
- [ ] Analyze user metrics (signups, bookings, retention)
- [ ] Plan feature improvements for version 1.1
- [ ] Expand gym partnerships
- [ ] Begin Android beta planning

---

**Last Updated**: November 25, 2025
**App Version**: 1.0.0
**Target Submission Date**: End of November 2025
**Target Launch Date**: Early December 2025
