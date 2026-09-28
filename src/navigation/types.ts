import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { SearchCriteria } from '@/types/flight';

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  FavoritesTab: NavigatorScreenParams<FavoritesStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
  MoreTab: NavigatorScreenParams<MoreStackParamList>;
};

export type FlightDetailsParams = {
  flightId: string;
  origin: string;
  destination: string;
  date: string;
};

export type HomeStackParamList = {
  Home: undefined;
  SearchResults: SearchCriteria;
  FlightDetails: FlightDetailsParams;
};

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, T>;

export type FavoritesStackParamList = {
  Favorites: undefined;
  FlightDetails: FlightDetailsParams;
};

export type FavoritesStackScreenProps<T extends keyof FavoritesStackParamList> =
  NativeStackScreenProps<FavoritesStackParamList, T>;

export type FlightDetailsScreenProps =
  | HomeStackScreenProps<'FlightDetails'>
  | FavoritesStackScreenProps<'FlightDetails'>;

export type ProfileStackParamList = {
  Profile: undefined;
};

export type MoreStackParamList = {
  More: undefined;
  Settings: undefined;
  Help: undefined;
  About: undefined;
  Contact: undefined;
};

export type MoreStackScreenProps<T extends keyof MoreStackParamList> =
  NativeStackScreenProps<MoreStackParamList, T>;
