import {
  createNativeStackNavigator,
  type NativeStackNavigationOptions,
} from '@react-navigation/native-stack';

import { FavoritesScreen } from '@/screens/favorites/FavoritesScreen';
import { FlightDetailsScreen } from '@/screens/flight-details/FlightDetailsScreen';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { MoreDetailScreen } from '@/screens/more/MoreDetailScreen';
import { MoreScreen } from '@/screens/more/MoreScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { SearchResultsScreen } from '@/screens/search-results/SearchResultsScreen';
import { formatRoute } from '@/utils/format';

import type {
  FavoritesStackParamList,
  HomeStackParamList,
  MoreStackParamList,
  ProfileStackParamList,
} from './types';

const screenOptions: NativeStackNavigationOptions = {
  headerShadowVisible: false,
  headerBackButtonDisplayMode: 'minimal',
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={screenOptions}>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={({ route }) => ({ title: formatRoute(route.params) })}
      />
      <HomeStack.Screen
        name="FlightDetails"
        component={FlightDetailsScreen}
        options={{ title: 'Flight Details' }}
      />
    </HomeStack.Navigator>
  );
}

const FavoritesStack = createNativeStackNavigator<FavoritesStackParamList>();

export function FavoritesStackNavigator() {
  return (
    <FavoritesStack.Navigator screenOptions={screenOptions}>
      <FavoritesStack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'Favorite Flights' }}
      />
      <FavoritesStack.Screen
        name="FlightDetails"
        component={FlightDetailsScreen}
        options={{ title: 'Flight Details' }}
      />
    </FavoritesStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={screenOptions}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}

const MoreStack = createNativeStackNavigator<MoreStackParamList>();

export function MoreStackNavigator() {
  return (
    <MoreStack.Navigator screenOptions={screenOptions}>
      <MoreStack.Screen name="More" component={MoreScreen} />
      <MoreStack.Screen name="Settings" component={MoreDetailScreen} />
      <MoreStack.Screen name="Help" component={MoreDetailScreen} />
      <MoreStack.Screen name="About" component={MoreDetailScreen} />
      <MoreStack.Screen name="Contact" component={MoreDetailScreen} />
    </MoreStack.Navigator>
  );
}
