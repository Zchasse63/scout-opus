# Scout - Quick Start Guide

Get Scout up and running in 5 minutes!

## Installation (2 minutes)

```bash
# Navigate to project
cd scout-app

# Install dependencies
npm install

# Verify TypeScript
npm run type-check

# Lint code
npm run lint
```

## Configuration (2 minutes)

```bash
# Copy environment template
cp .env.example .env.local

# Add your API keys:
# - EXPO_PUBLIC_SUPABASE_URL
# - EXPO_PUBLIC_SUPABASE_ANON_KEY
# - EXPO_PUBLIC_GOOGLE_PLACES_API_KEY
# - Other API keys as needed
```

## Run App (1 minute)

```bash
# Start development server
npm run ios

# App will open in iPhone simulator
# Press 's' to switch to list view, 'm' for map
# Press 'i' to open Xcode, 'j' for dev menu
```

## Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --coverage

# Watch mode (re-run on changes)
npm run test:watch

# E2E tests (requires built app)
npm run e2e
```

## Key Shortcuts in Development

| Key | Action |
|-----|--------|
| `r` | Reload app |
| `j` | Open developer menu |
| `i` | Open Xcode |
| `d` | Open debugger |
| `?` | Show all commands |

## Common Tasks

### Add a New Screen
1. Create file in `app/(tabs)/newscreen.tsx`
2. Add screen option in `app/(tabs)/_layout.tsx`
3. Use Expo Router navigation

### Add a New Component
1. Create file in `components/ui/MyComponent.tsx`
2. Export from `components/index.ts`
3. Import and use in screens

### Add State Management
1. Create hook in `hooks/useMyFeature.ts`
2. Use `useQuery` for server state or `useState` for UI state
3. For global state, create Zustand store in `stores/myStore.ts`

### Add a New API Call
1. Add Edge Function in `supabase/functions/`
2. Create hook: `hooks/useMyAPI.ts`
3. Use `supabase.functions.invoke('my-function')`
4. Handle loading, error, and success states

## File Structure Quick Reference

```
🎨 UI & Components
└── components/
    ├── search/          # Search UI
    ├── explore/         # Discovery UI
    └── ui/              # Reusable components

📱 Screens & Navigation
└── app/
    ├── (tabs)/          # Tab-based screens
    ├── (auth)/          # Auth screens
    ├── gym/             # Gym detail modal
    └── booking/         # Booking flow

🧠 Logic & State
├── hooks/              # Custom hooks
├── stores/             # Zustand stores
├── types/              # TypeScript types
└── lib/                # External integrations

🎨 Design & Constants
└── constants/          # Colors, spacing, typography

🧪 Tests
├── __tests__/          # Unit tests
└── e2e/                # E2E tests
```

## API Overview

### Authentication (Supabase)
```typescript
const { user, signIn, signOut } = useAuthStore();

// Sign in with email
await signIn('email', 'user@example.com');

// Sign out
await signOut();
```

### Search Gyms (TanStack Query)
```typescript
const { results, isLoading, setSearchQuery } = useGymSearch();

// Search for gyms
setSearchQuery('crossfit miami');
// Results auto-update as TanStack Query caches them
```

### Voice Search
```typescript
const { recordingState, transcript, startRecording, stopRecording } = useVoiceSearch();

// Start recording
await startRecording();

// Stop and transcribe
await stopRecording();
// transcript will contain result, intent parsed
```

### Booking
```typescript
const { setSelectedGym, setPassType, setSelectedDate } = useBookingStore();

// Set booking details
setSelectedGym(gym);
setPassType('day');
setSelectedDate('2025-01-15');
```

## Navigation Examples

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate to gym detail
router.push(`/gym/${gym.id}`);

// Navigate to booking
router.push(`/booking/${gym.id}`);

// Go back
router.back();

// Navigate to tab
router.navigate('/(tabs)/passes');
```

## Common Issues & Solutions

### Issue: App won't start
**Solution**:
```bash
npm install
npm run type-check
# Check .env.local has all required keys
```

### Issue: TypeScript errors
**Solution**:
```bash
npm run type-check
# Fix errors or add `// @ts-ignore` if intentional
```

### Issue: Tests failing
**Solution**:
```bash
npm test -- --no-coverage
# Check jest.setup.js mocks are correct
```

### Issue: Search returns no results
**Solution**:
```bash
# Check EXPO_PUBLIC_GOOGLE_PLACES_API_KEY in .env.local
# Verify Google Places API is enabled
# Check Edge Function is deployed
```

### Issue: Payment fails
**Solution**:
```bash
# Check Stripe keys in .env.local
# Verify Edge Function has Stripe secret key
# Test with Stripe test card: 4242 4242 4242 4242
```

## Performance Tips

1. **Avoid re-renders**
   - Use `useCallback` for event handlers
   - Use `useMemo` for expensive calculations
   - Memoize components with `React.memo`

2. **Optimize lists**
   - Always provide `key` prop
   - Use `FlatList` instead of `ScrollView` + map
   - Set `maxToRenderPerBatch` for large lists

3. **Cache data**
   - TanStack Query handles caching
   - Configure TTL in useQuery options
   - Manual refetch when needed

4. **Lazy load images**
   - Use `Image` component with dimensions
   - Load high-res on demand
   - Cache frequently used images

## Debugging Tips

### React DevTools
```bash
# Enable React DevTools in dev menu
1. Press 'j' to open dev menu
2. Select "Debug remote JS"
# Profiler will open in browser
```

### Console Logging
```typescript
// Good
console.error('User login failed:', error);
console.log('Search results:', results);

// Avoid in production
console.log('DEBUG:', something);
```

### Network Debugging
```typescript
// Check network calls
// Open dev menu → "Debug remote JS"
// Open browser DevTools Network tab
```

## Deployment

### TestFlight (Beta)
```bash
# Build for TestFlight
npm run build:ios

# Upload to App Store Connect
# Done via Xcode Organizer
```

### App Store (Production)
```bash
# Follow APP_STORE_CHECKLIST.md
# Build → Upload → Submit → Review → Launch
```

## Documentation

- **README.md** - Full project overview
- **IMPLEMENTATION_GUIDE.md** - Technical details
- **APP_STORE_CHECKLIST.md** - Launch preparation
- **COMPLETION_SUMMARY.md** - Project status

## Getting Help

1. **Check documentation** - Start with README.md
2. **Search codebase** - `Cmd+F` in VS Code
3. **Review similar code** - Find existing implementation
4. **Check TypeScript types** - Types give hints
5. **Debug in browser** - Use React DevTools

## Key Resources

- 📱 [Expo Documentation](https://docs.expo.dev)
- 🛣️ [Expo Router](https://expo.github.io/router)
- ⚛️ [React Native](https://reactnative.dev)
- 📚 [Zustand](https://github.com/pmndrs/zustand)
- 🔄 [TanStack Query](https://tanstack.com/query)
- 🗄️ [Supabase](https://supabase.com)

---

**Ready to build?** Start with `npm run ios` and explore the app! 🚀
