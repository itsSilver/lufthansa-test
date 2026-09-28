import type { Flight } from '@/types/flight';

import { logout } from '../auth';
import reducer, { removeFavorite, toggleFavorite } from '../favorites';

const flight = (id: string, departure: string): Flight => ({
  id,
  flightNumber: id.split('-')[0],
  airline: 'ITA Airways',
  departure: { airport: 'TIA', time: departure, terminal: null, gate: null },
  arrival: {
    airport: 'FCO',
    time: departure,
    terminal: '3',
    gate: null,
    baggage: null,
  },
  status: 'scheduled',
  delayMinutes: 0,
  aircraft: null,
  codeshares: [],
});

const initial = reducer(undefined, { type: 'init' });

describe('favorites', () => {
  it('adds a flight and removes it again when toggled twice', () => {
    const az = flight('AZ585-2026-10-12', '2026-10-12T11:30');

    let state = reducer(initial, toggleFavorite(az));
    expect(state.ids).toEqual([az.id]);
    expect(state.entities[az.id]).toEqual(az);

    state = reducer(state, toggleFavorite(az));
    expect(state.ids).toEqual([]);
  });

  it('keeps favorites sorted by departure time', () => {
    let state = reducer(
      initial,
      toggleFavorite(flight('LH2-2026-10-20', '2026-10-20T09:00')),
    );
    state = reducer(
      state,
      toggleFavorite(flight('AZ1-2026-10-12', '2026-10-12T11:30')),
    );

    expect(state.ids).toEqual(['AZ1-2026-10-12', 'LH2-2026-10-20']);
  });

  it('removes a favorite by id', () => {
    const state = reducer(
      reducer(
        initial,
        toggleFavorite(flight('W4-2026-10-12', '2026-10-12T14:40')),
      ),
      removeFavorite('W4-2026-10-12'),
    );

    expect(state.ids).toEqual([]);
  });
});

describe('favorites on logout', () => {
  it('clears all saved flights', () => {
    const state = reducer(
      reducer(
        initial,
        toggleFavorite(flight('AZ1-2026-10-12', '2026-10-12T11:30')),
      ),
      logout(),
    );

    expect(state.ids).toEqual([]);
  });
});
