import { Alert, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout, selectUser } from '@/store/slices/auth';

import { DarkModeToggle } from './components/DarkModeToggle';
import { UserCard } from './components/UserCard';

export function ProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const confirmLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => dispatch(logout()),
      },
    ]);
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-8 p-4">
      {user ? <UserCard user={user} /> : null}

      <View className="gap-3">
        <View className="gap-1 px-1">
          <Text className="font-sans-bold text-lg text-foreground">
            Appearance
          </Text>
          <Text className="font-sans text-sm text-muted">
            Follows your device until you change it
          </Text>
        </View>
        <DarkModeToggle />
      </View>

      <Button title="Log out" variant="secondary" onPress={confirmLogout} />
    </ScrollView>
  );
}
