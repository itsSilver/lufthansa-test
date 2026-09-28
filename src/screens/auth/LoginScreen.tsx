import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { TextField } from '@/components/ui/TextField';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearAuthError,
  login,
  selectAuthError,
  selectAuthStatus,
} from '@/store/slices/auth';
import { useThemeColors } from '@/theme/useThemeColors';

import { MIN_PASSWORD_LENGTH, validateLogin } from './validation';

export function LoginScreen() {
  const dispatch = useAppDispatch();
  const theme = useThemeColors();
  const insets = useSafeAreaInsets();
  const status = useAppSelector(selectAuthStatus);
  const authError = useAppSelector(selectAuthError);
  const passwordRef = useRef<TextInput>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const errors = hasSubmitted ? validateLogin(email, password) : {};
  const isLoading = status === 'loading';

  const onChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    if (authError) dispatch(clearAuthError());
  };

  const submit = () => {
    setHasSubmitted(true);
    const { email: emailError, password: passwordError } = validateLogin(
      email,
      password,
    );
    if (emailError || passwordError) return;
    dispatch(login({ email: email.trim(), password }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="grow justify-center gap-8 px-6"
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
        }}>
        <View className="items-center gap-3">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-primary/15">
            <Icon
              name={{ ios: 'airplane', android: 'flight' }}
              color={theme.primary}
              size={28}
            />
          </View>
          <Text className="font-sans-bold text-3xl text-foreground">
            Welcome back
          </Text>
          <Text className="text-center font-sans text-base text-muted">
            Sign in to search and save flights
          </Text>
        </View>

        <View className="gap-4">
          <TextField
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={onChange(setEmail)}
            error={errors.email}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
          <TextField
            ref={passwordRef}
            label="Password"
            placeholder="Your password"
            value={password}
            onChangeText={onChange(setPassword)}
            error={errors.password}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            autoComplete="password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={submit}
            trailing={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  isPasswordVisible ? 'Hide password' : 'Show password'
                }
                hitSlop={8}
                onPress={() => setIsPasswordVisible((visible) => !visible)}>
                <Icon
                  name={
                    isPasswordVisible
                      ? { ios: 'eye.slash', android: 'visibility_off' }
                      : { ios: 'eye', android: 'visibility' }
                  }
                  color={theme.muted}
                  size={20}
                />
              </Pressable>
            }
          />
          {authError ? (
            <Text className="px-1 font-sans text-sm text-danger">
              {authError}
            </Text>
          ) : null}
        </View>

        <View className="gap-4">
          <Button title="Sign In" loading={isLoading} onPress={submit} />
          <Text className="text-center font-sans text-sm text-muted">
            Demo: any email and a password with {MIN_PASSWORD_LENGTH}+
            characters
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
