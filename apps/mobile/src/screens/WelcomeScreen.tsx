import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { createWelcomeScreenViewModel } from '@/bootstrap/createWelcomeScreenViewModel';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';

type WelcomeScreenProps = {
  onStart: () => void;
};

export function WelcomeScreen({ onStart }: WelcomeScreenProps): React.JSX.Element {
  const viewModel = createWelcomeScreenViewModel();

  return (
    <ScreenContainer>
      <StatusBar style="dark" />
      <View style={styles.wrapper}>
        <Text style={styles.eyebrow}>{viewModel.eyebrow}</Text>
        <Text style={styles.title}>{viewModel.title}</Text>
        <Text style={styles.tagline}>{viewModel.tagline}</Text>
        <Text style={styles.description}>{viewModel.description}</Text>
        <PrimaryButton label={viewModel.primaryActionLabel} onPress={onStart} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 8,
    backgroundColor: '#f8f4ec',
  },
  eyebrow: {
    marginBottom: 12,
    color: '#1d4f91',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    marginBottom: 8,
    color: '#1c1d21',
    fontSize: 40,
    fontWeight: '800',
    textAlign: 'center',
  },
  tagline: {
    marginBottom: 18,
    color: '#a45a2a',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    maxWidth: 320,
    color: '#4f5663',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
