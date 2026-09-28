function numberFromEnv(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return value && Number.isFinite(parsed) ? parsed : fallback;
}

export const env = {
  mockApiDelayMs: numberFromEnv(process.env.EXPO_PUBLIC_MOCK_API_DELAY_MS, 800),
  sessionTtlDays: numberFromEnv(process.env.EXPO_PUBLIC_SESSION_TTL_DAYS, 7),
};
