import { NavigationContainer } from '@react-navigation/native';
import { act, screen } from '@testing-library/react-native';

import { completeOnboarding } from '@/store/slices/onboarding';
import { createTestStore, renderWithStore } from '@/test-utils/renderWithStore';

import { RootNavigator } from '../RootNavigator';

const loggedInAuth = {
  user: { name: 'Jane Doe', email: 'jane.doe@example.com' },
  token: 'mock-token',
  expiresAt: Date.now() + 60_000,
  status: 'idle' as const,
  error: null,
};

function renderRoot(store = createTestStore()) {
  return renderWithStore(
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>,
    store,
  );
}

describe('RootNavigator', () => {
  it('starts with onboarding on a fresh install', async () => {
    await renderRoot();

    expect(screen.getByText('Find your next flight')).toBeOnTheScreen();
  });

  it('shows login once onboarding is completed', async () => {
    const { store } = await renderRoot();

    await act(() => {
      store.dispatch(completeOnboarding());
    });

    expect(await screen.findByText('Welcome back')).toBeOnTheScreen();
    expect(screen.queryByText('Find your next flight')).toBeNull();
  });

  it('opens the app directly for a logged-in user', async () => {
    await renderRoot(
      createTestStore({
        onboarding: { hasSeenOnboarding: true, currentStep: 0 },
        auth: loggedInAuth,
      }),
    );

    expect(
      await screen.findByText(/Where would you\s+like to go\?/),
    ).toBeOnTheScreen();
  });
});
