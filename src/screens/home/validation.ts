export type TripType = 'round' | 'oneWay';

export type SearchForm = {
  tripType: TripType;
  origin: string | null;
  destination: string | null;
  departureDate: string;
  returnDate: string;
};

export type SearchErrors = Partial<
  Record<Exclude<keyof SearchForm, 'tripType'>, string>
>;

export function validateSearch(form: SearchForm, today: string): SearchErrors {
  const errors: SearchErrors = {};

  if (!form.origin) errors.origin = 'Choose where you fly from';
  if (!form.destination) errors.destination = 'Choose where you fly to';
  if (form.origin && form.origin === form.destination) {
    errors.destination = 'Origin and destination must be different';
  }
  if (form.departureDate < today) {
    errors.departureDate = 'Departure date is in the past';
  }
  if (form.tripType === 'round' && form.returnDate < form.departureDate) {
    errors.returnDate = 'Return date must be after departure';
  }

  return errors;
}

export const hasErrors = (errors: SearchErrors) =>
  Object.keys(errors).length > 0;
