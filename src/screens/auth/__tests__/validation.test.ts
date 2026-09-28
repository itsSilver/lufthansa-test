import { validateLogin } from '../validation';

describe('validateLogin', () => {
  it('accepts a valid email and password', () => {
    expect(validateLogin('jane.doe@example.com', 'secret1')).toEqual({});
  });

  it('requires both fields', () => {
    expect(validateLogin('', '')).toEqual({
      email: 'Enter your email',
      password: 'Enter your password',
    });
  });

  it('rejects a malformed email and a short password', () => {
    const errors = validateLogin('jane@', '123');
    expect(errors.email).toBe('Enter a valid email address');
    expect(errors.password).toMatch(/at least 6/);
  });
});
