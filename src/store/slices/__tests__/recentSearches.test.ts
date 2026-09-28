import { logout } from '../auth';
import reducer, {
  addRecentSearch,
  clearRecentSearches,
  MAX_RECENT_SEARCHES,
  removeRecentSearch,
} from '../recentSearches';

const search = (destination: string, departureDate = '2026-10-12') => ({
  origin: 'TIA',
  destination,
  departureDate,
  returnDate: '2026-10-15',
});

const initial = reducer(undefined, { type: 'init' });

describe('recentSearches', () => {
  it('adds new searches to the top', () => {
    let state = reducer(initial, addRecentSearch(search('FCO')));
    state = reducer(state, addRecentSearch(search('MUC')));

    expect(state.items.map((item) => item.destination)).toEqual(['MUC', 'FCO']);
  });

  it('moves a repeated search to the top instead of duplicating it', () => {
    let state = reducer(initial, addRecentSearch(search('FCO')));
    state = reducer(state, addRecentSearch(search('MUC')));
    state = reducer(state, addRecentSearch(search('FCO')));

    expect(state.items.map((item) => item.destination)).toEqual(['FCO', 'MUC']);
  });

  it('treats the same route on different dates as separate searches', () => {
    let state = reducer(initial, addRecentSearch(search('FCO', '2026-10-12')));
    state = reducer(state, addRecentSearch(search('FCO', '2026-10-20')));

    expect(state.items).toHaveLength(2);
  });

  it(`keeps at most ${MAX_RECENT_SEARCHES} searches, dropping the oldest`, () => {
    let state = initial;
    for (let i = 0; i < MAX_RECENT_SEARCHES + 3; i++) {
      state = reducer(
        state,
        addRecentSearch(
          search('FCO', `2026-10-${String(i + 1).padStart(2, '0')}`),
        ),
      );
    }

    expect(state.items).toHaveLength(MAX_RECENT_SEARCHES);
    expect(state.items[0].departureDate).toBe('2026-10-13');
    expect(state.items.at(-1)?.departureDate).toBe('2026-10-04');
  });

  it('removes a single search and clears all', () => {
    let state = reducer(initial, addRecentSearch(search('FCO')));
    state = reducer(state, addRecentSearch(search('MUC')));

    state = reducer(state, removeRecentSearch(state.items[0].id));
    expect(state.items.map((item) => item.destination)).toEqual(['FCO']);

    state = reducer(state, clearRecentSearches());
    expect(state.items).toEqual([]);
  });
});

describe('recentSearches on logout', () => {
  it('clears the list', () => {
    const state = reducer(
      reducer(initial, addRecentSearch(search('FCO'))),
      logout(),
    );

    expect(state.items).toEqual([]);
  });
});
