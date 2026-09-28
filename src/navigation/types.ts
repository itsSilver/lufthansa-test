import type { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  FavoritesTab: NavigatorScreenParams<FavoritesStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
  MoreTab: NavigatorScreenParams<MoreStackParamList>;
};

export type HomeStackParamList = {
  Home: undefined;
};

export type FavoritesStackParamList = {
  Favorites: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
};

export type MoreStackParamList = {
  More: undefined;
};
