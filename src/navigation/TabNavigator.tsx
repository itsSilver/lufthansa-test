import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Icon, type IconName } from '@/components/ui/Icon';

import {
  FavoritesStackNavigator,
  HomeStackNavigator,
  MoreStackNavigator,
  ProfileStackNavigator,
} from './stacks';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

function tabIcon(name: IconName) {
  return function TabIcon({ color, size }: { color: string; size: number }) {
    return <Icon name={name} color={color} size={size} />;
  };
}

export function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: 'Home',
          tabBarIcon: tabIcon({ ios: 'airplane', android: 'flight' }),
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStackNavigator}
        options={{
          title: 'Favorites',
          tabBarIcon: tabIcon({ ios: 'heart', android: 'favorite' }),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          title: 'Profile',
          tabBarIcon: tabIcon({ ios: 'person', android: 'person' }),
        }}
      />
      <Tab.Screen
        name="MoreTab"
        component={MoreStackNavigator}
        options={{
          title: 'More',
          tabBarIcon: tabIcon({ ios: 'ellipsis', android: 'more_horiz' }),
        }}
      />
    </Tab.Navigator>
  );
}
