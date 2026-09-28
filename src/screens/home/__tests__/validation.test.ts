import { hasErrors, validateSearch, type SearchForm } from '../validation';

const TODAY = '2026-10-01';

const validForm: SearchForm = {
  tripType: 'round',
  origin: 'TIA',
  destination: 'FCO',
  departureDate: '2026-10-12',
  returnDate: '2026-10-15',
};

describe('validateSearch', () => {
  it('accepts a complete form', () => {
    expect(hasErrors(validateSearch(validForm, TODAY))).toBe(false);
  });

  it('rejects the same origin and destination', () => {
    const errors = validateSearch({ ...validForm, destination: 'TIA' }, TODAY);
    expect(errors.destination).toBe('Origin and destination must be different');
  });

  it('requires both airports', () => {
    const errors = validateSearch(
      { ...validForm, origin: null, destination: null },
      TODAY,
    );
    expect(errors.origin).toBeDefined();
    expect(errors.destination).toBeDefined();
  });

  it('rejects a departure in the past', () => {
    const errors = validateSearch(
      { ...validForm, departureDate: '2026-09-30' },
      TODAY,
    );
    expect(errors.departureDate).toBeDefined();
  });

  it('rejects a return before the departure', () => {
    const errors = validateSearch(
      { ...validForm, returnDate: '2026-10-11' },
      TODAY,
    );
    expect(errors.returnDate).toBeDefined();
  });

  it('allows returning on the departure day', () => {
    const errors = validateSearch(
      { ...validForm, returnDate: validForm.departureDate },
      TODAY,
    );
    expect(hasErrors(errors)).toBe(false);
  });
});

describe('validateSearch one way', () => {
  it('ignores the return date', () => {
    const errors = validateSearch(
      { ...validForm, tripType: 'oneWay', returnDate: '2026-10-01' },
      TODAY,
    );
    expect(hasErrors(errors)).toBe(false);
  });
});
