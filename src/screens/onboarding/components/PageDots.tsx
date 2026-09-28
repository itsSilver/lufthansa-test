import { View } from 'react-native';

type Props = {
  count: number;
  activeIndex: number;
};

export function PageDots({ count, activeIndex }: Props) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: count }, (_, index) => (
        <View
          key={index}
          className={`h-2 rounded-full ${
            index === activeIndex ? 'w-6 bg-primary' : 'w-2 bg-border'
          }`}
        />
      ))}
    </View>
  );
}
