import type { ImageSourcePropType } from 'react-native';

export type Slide = {
  key: string;
  image: ImageSourcePropType;
  title: string;
  description: string;
};

export const slides: Slide[] = [
  {
    key: 'search',
    image: require('@/assets/images/onboarding/slide-1.jpg'),
    title: 'Find your next flight',
    description:
      'Search any route and date, and see every option in one place.',
  },
  {
    key: 'favorites',
    image: require('@/assets/images/onboarding/slide-2.jpg'),
    title: 'Save the ones you like',
    description:
      'Keep your favorite flights close and come back to them any time.',
  },
  {
    key: 'details',
    image: require('@/assets/images/onboarding/slide-3.jpg'),
    title: 'Ready before takeoff',
    description:
      'Check times, gate, aircraft and status before you head to the airport.',
  },
];

export const onboardingImages = slides.map((slide) => slide.image as number);
