export type Destination = {
  code: string;
  city: string;
  image: number;
};

export const popularDestinations: Destination[] = [
  {
    code: 'LHR',
    city: 'London',
    image: require('@/assets/images/destinations/london.jpg'),
  },
  {
    code: 'FCO',
    city: 'Rome',
    image: require('@/assets/images/destinations/rome.jpg'),
  },
  {
    code: 'CDG',
    city: 'Paris',
    image: require('@/assets/images/destinations/paris.jpg'),
  },
  {
    code: 'JFK',
    city: 'New York',
    image: require('@/assets/images/destinations/new-york.jpg'),
  },
];

export const heroImage: number = require('@/assets/images/hero-plane.jpg');

export const homeImages = [
  heroImage,
  ...popularDestinations.map((destination) => destination.image),
];
