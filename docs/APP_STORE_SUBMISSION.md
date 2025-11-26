# App Store Submission Guide

## Pre-Submission Checklist

### Code & Build
- [ ] All features implemented and tested
- [ ] No console.log statements in production
- [ ] Error tracking (Sentry) configured
- [ ] Analytics (Mixpanel) configured
- [ ] All environment variables set for production

### App Store Connect
- [ ] App created in App Store Connect
- [ ] App Information completed
- [ ] Pricing and Availability set
- [ ] App Privacy questionnaire completed
- [ ] In-App Purchases configured (if applicable)

### Assets
- [ ] App icon (1024x1024, no alpha)
- [ ] Screenshots for all required device sizes
- [ ] App Preview videos (optional)

### Legal
- [ ] Privacy Policy URL live
- [ ] Terms of Service URL live
- [ ] EULA (if custom)

## Step 1: Final Production Build

```bash
# Ensure all environment variables are set
cat .env | grep EXPO_PUBLIC

# Build production iOS app
npx eas build --platform ios --profile production

# Wait for build to complete (10-20 minutes)
```

## Step 2: Submit to App Store

```bash
# Submit latest build
npx eas submit --platform ios --profile production

# Or submit specific build
npx eas submit --platform ios --id BUILD_ID
```

## Step 3: Complete App Store Connect

### Version Information
1. Go to App Store Connect → Your App
2. Click "+ Version or Platform" if needed
3. Fill in "What's New in This Version"

### App Review Information
- Contact info for reviewer
- Demo account credentials
- Notes about features requiring special setup

### Release Options
- **Manual Release**: You control when it goes live
- **Automatic Release**: Goes live immediately after approval
- **Scheduled Release**: Set specific date/time

## Step 4: Submit for Review

1. Click "Add for Review"
2. Review all information
3. Click "Submit to App Review"

## Review Timeline

- **Average**: 24-48 hours
- **First submission**: May take longer
- **Rejections**: Address issues and resubmit

## Common Rejection Reasons

### 1. Guideline 2.1 - App Completeness
- Ensure all features work
- No placeholder content
- No broken links

### 2. Guideline 4.2 - Minimum Functionality
- App must provide value
- Not just a website wrapper

### 3. Guideline 5.1.1 - Data Collection
- Privacy policy must match data collection
- Request only necessary permissions

### 4. Guideline 3.1.1 - In-App Purchase
- All digital goods must use IAP
- Physical goods/services can use external payment

## Post-Approval

### Monitor
- Check App Store Connect for status
- Monitor crash reports in Sentry
- Track analytics in Mixpanel

### Respond to Reviews
- Reply to user reviews in App Store Connect
- Address issues in next update

## Android Submission (Google Play)

```bash
# Build Android app bundle
npx eas build --platform android --profile production

# Submit to Google Play
npx eas submit --platform android --profile production
```

### Google Play Requirements
- Service account JSON for automated submission
- Content rating questionnaire
- Data safety section
- Target API level compliance

## Rollout Strategy

### Phased Release (iOS)
- Release to percentage of users over 7 days
- Monitor for issues before full release

### Staged Rollout (Android)
- Start with 5-10% of users
- Increase gradually based on crash rate

