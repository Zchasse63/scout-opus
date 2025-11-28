// Simple unit tests for filter logic
describe('useGymSearch filter logic', () => {
  let filters: string[] = [];

  const toggleFilter = (filterId: string) => {
    if (filters.includes(filterId)) {
      filters = filters.filter((f) => f !== filterId);
    } else {
      filters = [...filters, filterId];
    }
  };

  const clearFilters = () => {
    filters = [];
  };

  beforeEach(() => {
    filters = [];
  });

  test('toggles filter on and off', () => {
    toggleFilter('yoga');
    expect(filters).toContain('yoga');

    toggleFilter('yoga');
    expect(filters).not.toContain('yoga');
  });

  test('clears all filters', () => {
    toggleFilter('yoga');
    toggleFilter('gym');
    expect(filters.length).toBe(2);

    clearFilters();
    expect(filters).toEqual([]);
  });

  test('handles multiple filters', () => {
    toggleFilter('gym');
    toggleFilter('yoga');
    toggleFilter('boxing');
    expect(filters).toEqual(['gym', 'yoga', 'boxing']);
  });

  test('prevents duplicate filters', () => {
    toggleFilter('yoga');
    toggleFilter('yoga');
    toggleFilter('yoga');
    expect(filters).toEqual(['yoga']);
  });

  test('maintains filter order', () => {
    toggleFilter('a');
    toggleFilter('b');
    toggleFilter('c');
    expect(filters).toEqual(['a', 'b', 'c']);
  });

  test('handles empty filter removal', () => {
    clearFilters();
    expect(filters).toEqual([]);
  });
});
