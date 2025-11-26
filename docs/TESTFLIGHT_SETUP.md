# TestFlight Beta Setup Guide

## Prerequisites

1. **Apple Developer Account** - Enrolled in Apple Developer Program ($99/year)
2. **App Store Connect Access** - Admin or App Manager role
3. **EAS CLI** - Installed and authenticated (`npx eas login`)

## Step 1: Configure EAS Credentials

```bash
# Login to EAS
npx eas login

# Configure iOS credentials
npx eas credentials

# Select: iOS > Build Credentials > Set up new credentials
# This will create:
# - Distribution Certificate
# - Provisioning Profile
```

## Step 2: Create App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - Platform: iOS
   - Name: Scout
   - Primary Language: English (U.S.)
   - Bundle ID: com.scoutfitness.app
   - SKU: scout-fitness-001
   - User Access: Full Access

## Step 3: Build for TestFlight

```bash
# Build production iOS app
npx eas build --platform ios --profile production

# This will:
# 1. Bundle the JavaScript
# 2. Build the native iOS app
# 3. Sign with your credentials
# 4. Upload to EAS servers
```

## Step 4: Submit to TestFlight

```bash
# Submit the latest build to App Store Connect
npx eas submit --platform ios --profile production

# Or submit a specific build
npx eas submit --platform ios --id BUILD_ID
```

## Step 5: Configure TestFlight in App Store Connect

### Internal Testing (up to 100 testers)
1. Go to App Store Connect → Your App → TestFlight
2. Click "Internal Testing" → "+" to create a group
3. Add testers by Apple ID email
4. Testers receive email invitation

### External Testing (up to 10,000 testers)
1. Click "External Testing" → "+" to create a group
2. Add testers or create public link
3. Submit for Beta App Review (usually 24-48 hours)
4. Once approved, testers can install

## Step 6: Test Information

Add test information in App Store Connect:
- Beta App Description
- Feedback Email
- Privacy Policy URL
- Test Notes for each build

## Tester Groups

### Internal Testers
- Team members with App Store Connect access
- No review required
- Immediate access to new builds

### External Testers
- Anyone with Apple ID
- Requires Beta App Review
- Can use public TestFlight link

## Build Versioning

EAS handles versioning automatically with `appVersionSource: "remote"`:
- Each build increments the build number
- Version stays at 1.0.0 until you change it in app.json

## Monitoring

### TestFlight Feedback
- Testers can send feedback directly from the app
- Screenshots and crash logs included
- View in App Store Connect → TestFlight → Feedback

### Crash Reports
- View in App Store Connect → TestFlight → Crashes
- Also available in Sentry dashboard

## Checklist

- [ ] Apple Developer account enrolled
- [ ] App created in App Store Connect
- [ ] EAS credentials configured
- [ ] First build submitted
- [ ] Internal testers added
- [ ] External testing group created
- [ ] Beta App Review submitted
- [ ] Public TestFlight link generated (optional)

