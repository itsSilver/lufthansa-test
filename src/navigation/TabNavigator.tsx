import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';

import {
  FavoritesStackNavigator,
  HomeStackNavigator,
  MoreStackNavigator,
  ProfileStackNavigator,
} from './stacks';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabNavigatorType = typeof Tab;

declare module '@react-navigation/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RootNavigator extends TabNavigatorType {}
}

type AndroidSymbol = NonNullable<
  Extract<SymbolViewProps['name'], object>['android']
>;
type IosSymbol = NonNullable<Extract<SymbolViewProps['name'], object>['ios']>;

function tabIcon(ios: IosSymbol, material: AndroidSymbol) {
  return function TabIcon({ color, size }: { color: string; size: number }) {
    return (
      <SymbolView
        name={{ ios, android: material, web: material }}
        tintColor={color}
        size={size}
      />
    );
  };
}

export function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{ title: 'Home', tabBarIcon: tabIcon('airplane', 'flight') }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStackNavigator}
        options={{
          title: 'Favorites',
          tabBarIcon: tabIcon('heart', 'favorite'),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{ title: 'Profile', tabBarIcon: tabIcon('person', 'person') }}
      />
      <Tab.Screen
        name="MoreTab"
        component={MoreStackNavigator}
        options={{
          title: 'More',
          tabBarIcon: tabIcon('ellipsis', 'more_horiz'),
        }}
      />
    </Tab.Navigator>
  );
}
