import { Text, View } from 'react-native';

import type { User } from '@/services/auth';

function initialsOf(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export function UserCard({ user }: { user: User }) {
  return (
    <View className="flex-row items-center gap-4 rounded-3xl bg-surface p-4">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-primary">
        <Text className="font-sans-bold text-lg text-primary-foreground">
          {initialsOf(user.name)}
        </Text>
      </View>
      <View className="flex-1 gap-0.5">
        <Text
          numberOfLines={1}
          className="font-sans-bold text-lg text-foreground">
          {user.name}
        </Text>
        <Text numberOfLines={1} className="font-sans text-sm text-muted">
          {user.email}
        </Text>
      </View>
    </View>
  );
}
