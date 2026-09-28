import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithStore } from '@/test-utils/renderWithStore';
import type { Flight } from '@/types/flight';

import { FlightCard } from '../FlightCard';

const flight: Flight = {
  id: 'AZ585-2026-10-12',
  flightNumber: 'AZ585',
  airline: 'ITA Airways',
  departure: {
    airport: 'TIA',
    time: '2026-10-12T11:30',
    terminal: null,
    gate: null,
  },
  arrival: {
    airport: 'FCO',
    time: '2026-10-12T12:55',
    terminal: '3',
    gate: null,
    baggage: null,
  },
  status: 'scheduled',
  delayMinutes: 0,
  aircraft: null,
  codeshares: [],
};

describe('FlightCard', () => {
  it('shows the flight number, airline and times', async () => {
    await renderWithStore(<FlightCard flight={flight} onPress={jest.fn()} />);

    expect(screen.getByText('ITA Airways')).toBeOnTheScreen();
    expect(screen.getByText('AZ585')).toBeOnTheScreen();
    expect(screen.getByText('11:30')).toBeOnTheScreen();
    expect(screen.getByText('12:55')).toBeOnTheScreen();
    expect(screen.getByText('1h 25m')).toBeOnTheScreen();
  });

  it('opens the flight when the card is pressed', async () => {
    const onPress = jest.fn();
    await renderWithStore(<FlightCard flight={flight} onPress={onPress} />);

    await fireEvent.press(screen.getByText('ITA Airways'));

    expect(onPress).toHaveBeenCalledWith(flight);
  });

  it('saves and removes the flight with the heart button', async () => {
    const onPress = jest.fn();
    const { store } = await renderWithStore(
      <FlightCard flight={flight} onPress={onPress} />,
    );

    await fireEvent.press(screen.getByLabelText('Save AZ585 to favorites'));
    expect(store.getState().favorites.ids).toEqual([flight.id]);
    expect(onPress).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByLabelText('Remove AZ585 from favorites'));
    expect(store.getState().favorites.ids).toEqual([]);
  });

  it('only shows a status badge when the flight is not on schedule', async () => {
    const { rerender } = await renderWithStore(
      <FlightCard flight={flight} onPress={jest.fn()} />,
    );
    expect(screen.queryByText('Scheduled')).toBeNull();

    await rerender(
      <FlightCard
        flight={{ ...flight, status: 'delayed', delayMinutes: 25 }}
        onPress={jest.fn()}
      />,
    );
    expect(screen.getByText('Delayed 25m')).toBeOnTheScreen();
  });
});
