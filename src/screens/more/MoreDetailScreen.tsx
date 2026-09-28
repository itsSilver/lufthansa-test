import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';
import type { MoreStackScreenProps } from '@/navigation/types';

type Props = MoreStackScreenProps<'Settings' | 'Help' | 'About' | 'Contact'>;

export function MoreDetailScreen({ route }: Props) {
  return <ScreenPlaceholder title={route.name} description="Coming soon" />;
}
