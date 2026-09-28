import { env } from '@/config/env';

export type Credentials = {
  email: string;
  password: string;
};

export type User = {
  name: string;
  email: string;
};

export type Session = {
  user: User;
  token: string;
  expiresAt: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function nameFromEmail(email: string) {
  return email
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

export async function signIn({
  email,
  password,
}: Credentials): Promise<Session> {
  await wait(env.mockApiDelayMs);

  if (password.length < 6) {
    throw new Error('Incorrect email or password');
  }

  return {
    user: { name: nameFromEmail(email), email },
    token: `mock-token-${Date.now()}`,
    expiresAt: Date.now() + env.sessionTtlDays * DAY_MS,
  };
}
