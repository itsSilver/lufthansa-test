import { Text, View } from 'react-native';

type Props = {
  title: string;
  description?: string;
};

export function ScreenPlaceholder({ title, description }: Props) {
  return (
    <View className="flex-1 items-center justify-center gap-3 bg-background px-6">
      <Text className="font-sans-bold text-2xl text-foreground">{title}</Text>
      {description ? (
        <Text className="text-center font-sans text-base text-muted">{description}</Text>
      ) : null}
    </View>
  );
}
