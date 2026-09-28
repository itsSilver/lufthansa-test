import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/store';

type OnboardingState = {
  hasSeenOnboarding: boolean;
  currentStep: number;
};

const initialState: OnboardingState = {
  hasSeenOnboarding: false,
  currentStep: 0,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setOnboardingStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },
    completeOnboarding(state) {
      state.hasSeenOnboarding = true;
      state.currentStep = 0;
    },
  },
});

export const { setOnboardingStep, completeOnboarding } =
  onboardingSlice.actions;

export const selectHasSeenOnboarding = (state: RootState) =>
  state.onboarding.hasSeenOnboarding;
export const selectOnboardingStep = (state: RootState) =>
  state.onboarding.currentStep;

export default onboardingSlice.reducer;
