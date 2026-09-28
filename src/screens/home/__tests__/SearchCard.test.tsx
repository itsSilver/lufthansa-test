import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithStore } from '@/test-utils/renderWithStore';

import { SearchCard } from '../components/SearchCard';
import { validateSearch, type SearchForm } from '../validation';

const TODAY = '2026-10-01';

const baseForm: SearchForm = {
  tripType: 'round',
  origin: 'TIA',
  destination: 'FCO',
  departureDate: '2026-10-12',
  returnDate: '2026-10-15',
};

function renderCard(form: SearchForm) {
  const handlers = {
    onChange: jest.fn(),
    onDatesChange: jest.fn(),
    onSwap: jest.fn(),
    onSubmit: jest.fn(),
  };
  const result = renderWithStore(
    <SearchCard
      form={form}
      errors={validateSearch(form, TODAY)}
      today={TODAY}
      {...handlers}
    />,
  );
  return { ...handlers, result };
}

describe('SearchCard', () => {
  it('shows an error when origin and destination are the same', async () => {
    await renderCard({ ...baseForm, destination: 'TIA' }).result;

    expect(
      screen.getByText('Origin and destination must be different'),
    ).toBeOnTheScreen();
  });

  it('shows both dates for a round trip and only departure for one way', async () => {
    const { rerender } = await renderCard(baseForm).result;
    expect(screen.getByLabelText(/^Return:/)).toBeOnTheScreen();

    await rerender(
      <SearchCard
        form={{ ...baseForm, tripType: 'oneWay' }}
        errors={{}}
        today={TODAY}
        onChange={jest.fn()}
        onDatesChange={jest.fn()}
        onSwap={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );
    expect(screen.getByLabelText(/^Departure:/)).toBeOnTheScreen();
    expect(screen.queryByLabelText(/^Return:/)).toBeNull();
  });

  it('switches trip type, swaps airports and submits', async () => {
    const card = renderCard(baseForm);
    await card.result;

    await fireEvent.press(screen.getByText('One way'));
    expect(card.onChange).toHaveBeenCalledWith('tripType', 'oneWay');

    await fireEvent.press(screen.getByLabelText('Swap origin and destination'));
    expect(card.onSwap).toHaveBeenCalled();

    await fireEvent.press(screen.getByLabelText('Search Flight'));
    expect(card.onSubmit).toHaveBeenCalled();
  });
});
