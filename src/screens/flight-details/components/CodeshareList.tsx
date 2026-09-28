import { Text, View } from 'react-native';

export function CodeshareList({ codeshares }: { codeshares: string[] }) {
  if (codeshares.length === 0) return null;

  return (
    <View className="gap-3 rounded-3xl bg-surface p-5">
      <Text className="font-sans text-sm text-muted">Also sold as</Text>
      <View className="flex-row flex-wrap gap-2">
        {codeshares.map((code) => (
          <View key={code} className="rounded-full bg-field px-3 py-1.5">
            <Text className="font-sans-medium text-sm text-foreground">
              {code}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
