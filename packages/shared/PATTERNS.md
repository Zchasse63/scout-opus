# Scout Unified Development Patterns

This document defines the standard patterns for API calls, error handling, loading states, and toasts across all Scout projects (mobile app, admin portal, partner portal).

## 1. API Call Pattern

### React Query for Data Fetching

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

// Query hook pattern
export function useBookings(userId: string) {
  return useQuery({
    queryKey: ['bookings', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Mutation hook pattern
export function useCreateBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (booking: CreateBookingInput) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert(booking)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
```

### Edge Function Calls

```typescript
async function callEdgeFunction<T>(name: string, body: object): Promise<T> {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) throw new Error(error.message);
  return data as T;
}
```

## 2. Error Handling Pattern

### Error Boundary (React)

```typescript
// Use ErrorBoundary component at route level
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### Try-Catch with Toast

```typescript
try {
  await mutation.mutateAsync(data);
  showToast({ type: 'success', message: 'Booking created!' });
} catch (error) {
  showToast({ 
    type: 'error', 
    message: error instanceof Error ? error.message : 'An error occurred' 
  });
}
```

### Error Response Format

```typescript
interface ErrorResponse {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}
```

## 3. Loading State Pattern

### Query Loading States

```typescript
const { data, isLoading, isError, error } = useQuery(...);

if (isLoading) return <LoadingSpinner />;
if (isError) return <ErrorMessage error={error} />;
return <DataDisplay data={data} />;
```

### Mutation Loading States

```typescript
const mutation = useMutation(...);

<Button 
  onPress={() => mutation.mutate(data)}
  disabled={mutation.isPending}
>
  {mutation.isPending ? 'Saving...' : 'Save'}
</Button>
```

### Store Loading States (Zustand)

```typescript
interface StoreState {
  data: Data | null;
  isLoading: boolean;
  error: string | null;
  
  fetchData: () => Promise<void>;
}

const useStore = create<StoreState>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  
  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.fetchData();
      set({ data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
```

## 4. Toast Pattern

### Toast Types

```typescript
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // ms, default 3000
}
```

### Usage

```typescript
// Success
showToast({ type: 'success', message: 'Booking confirmed!' });

// Error
showToast({ type: 'error', message: 'Payment failed. Please try again.' });

// Warning
showToast({ type: 'warning', message: 'Your session will expire soon.' });

// Info
showToast({ type: 'info', message: 'New gyms available in your area!' });
```

## 5. Form Validation Pattern

Use Zod schemas from `@scout/shared`:

```typescript
import { bookingRequestSchema, validate } from '@scout/shared';

const result = validate(bookingRequestSchema, formData);
if (!result.success) {
  showToast({ type: 'error', message: result.error });
  return;
}
// Proceed with validated data
```

## 6. Pagination Pattern

```typescript
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['gyms', filters],
  queryFn: ({ pageParam = 1 }) => fetchGyms({ ...filters, page: pageParam }),
  getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
});
```

## 7. Real-time Updates Pattern

```typescript
import { useRealtimeBookings } from '../hooks/useRealtimeBookings';

// Subscribe to user's booking updates
useRealtimeBookings({
  userId: currentUser.id,
  onUpdate: (booking) => {
    showToast({ type: 'info', message: `Booking ${booking.id} updated` });
  },
});
```

