# Scout Fitness App - Test Implementation Guide

**Document Date:** 2025-11-27  
**Status:** Complete Guide

---

## Quick Start

### Run Tests
```bash
npm test                              # Run all tests
npm test -- --coverage               # With coverage report
npm test -- --testPathPattern="auth" # Run specific tests
npm test -- --watch                  # Watch mode
```

### Test Structure
```
__tests__/
├── hooks/
│   ├── useBookings.test.ts ✅
│   ├── useGymSearch.test.ts
│   └── ...
├── stores/
│   ├── authStore.test.ts
│   ├── bookingStore.test.ts ✅
│   └── ...
└── ...

hooks/__tests__/
├── useNotifications.test.ts ✅
├── useCalendarSync.test.ts ✅
└── ...

components/ui/__tests__/
├── Button.test.tsx ✅
├── Card.test.tsx ✅
└── ...
```

---

## Testing Patterns

### 1. Hook Testing Pattern

```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { useBookings } from '@/hooks/useBookings';

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useBookings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock implementation
    (mockSupabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => 
            Promise.resolve({ data: [], error: null })
          ),
        })),
      })),
    }));
  });

  test('returns empty array when no bookings exist', async () => {
    const { result } = renderHook(() => useBookings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual([]);
  });
});
```

### 2. Component Testing Pattern

```typescript
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  test('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeTruthy();
  });

  test('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Button onPress={onPress}>Click</Button>);
    
    fireEvent.press(screen.getByText('Click'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### 3. Store Testing Pattern

```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useAuthStore } from '@/stores/authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null });
  });

  test('sets user', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.setUser({ id: '1', email: 'test@example.com' });
    });

    expect(result.current.user?.email).toBe('test@example.com');
  });
});
```

---

## Mock Setup

### Supabase Mock (jest.setup.js)

```javascript
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(() => 
        Promise.resolve({ 
          data: { user: { id: 'user-123' } }, 
          error: null 
        })
      ),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => 
            Promise.resolve({ data: [], error: null })
          ),
        })),
        order: jest.fn(() => 
          Promise.resolve({ data: [], error: null })
        ),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => 
            Promise.resolve({ data: null, error: null })
          ),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => 
          Promise.resolve({ error: null })
        ),
      })),
    })),
  })),
}));
```

### React Query Mock

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
```

---

## Common Test Utilities

### Wait for Async Operations

```typescript
import { waitFor } from '@testing-library/react-native';

// Wait for hook to finish loading
await waitFor(() => {
  expect(result.current.isLoading).toBe(false);
});

// Wait for specific condition
await waitFor(() => {
  expect(result.current.data).toBeDefined();
}, { timeout: 3000 });
```

### Mock Supabase Query

```typescript
// Mock successful query
(mockSupabase.from as jest.Mock).mockImplementation(() => ({
  select: jest.fn(() => ({
    eq: jest.fn(() => ({
      order: jest.fn(() => 
        Promise.resolve({ 
          data: [{ id: 1, name: 'Test' }], 
          error: null 
        })
      ),
    })),
  })),
}));

// Mock error
(mockSupabase.from as jest.Mock).mockImplementation(() => ({
  select: jest.fn(() => ({
    eq: jest.fn(() => ({
      order: jest.fn(() => 
        Promise.resolve({ 
          data: null, 
          error: { message: 'Database error' } 
        })
      ),
    })),
  })),
}));
```

### Mock Zustand Store

```typescript
import { useAuthStore } from '@/stores/authStore';

beforeEach(() => {
  useAuthStore.setState({
    user: null,
    token: null,
    isLoading: false,
  });
});

// Set state for test
act(() => {
  useAuthStore.setState({
    user: { id: '1', email: 'test@example.com' },
    token: 'test-token',
  });
});
```

---

## Testing Checklist

### Before Writing Tests
- [ ] Understand component/hook behavior
- [ ] Identify external dependencies (APIs, stores, etc.)
- [ ] Plan mock strategy
- [ ] List all test cases

### While Writing Tests
- [ ] Use descriptive test names
- [ ] Test one thing per test
- [ ] Mock external dependencies
- [ ] Use `waitFor` for async operations
- [ ] Clean up mocks in `beforeEach`

### After Writing Tests
- [ ] All tests pass
- [ ] Coverage > 80% for component
- [ ] No console errors/warnings
- [ ] Mocks are properly reset

---

## Coverage Goals

| Category | Target | Current |
|----------|--------|---------|
| Statements | 60% | 7.11% |
| Branches | 60% | 5.26% |
| Functions | 60% | 6.67% |
| Lines | 60% | 7.11% |

---

## Debugging Tests

### View Test Output
```bash
npm test -- --verbose
```

### Debug Specific Test
```bash
npm test -- --testNamePattern="test name"
```

### Check Open Handles
```bash
npm test -- --detectOpenHandles
```

### View Coverage Report
```bash
npm test -- --coverage
open coverage/lcov-report/index.html
```

---

## Next Steps

1. Review `TEST_INVENTORY.md` for all testable units
2. Follow `TEST_ACTION_PLAN.md` for implementation timeline
3. Use patterns above for new tests
4. Run tests frequently during development
5. Aim for 60% coverage by end of Phase 2

See `# Scout Fitness App - Testing Audit.md` for full audit details.

