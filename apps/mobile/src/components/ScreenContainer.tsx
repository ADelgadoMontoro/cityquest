import type { PropsWithChildren } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

export function ScreenContainer({ children }: PropsWithChildren): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f4ec',
  },
  content: {
    flex: 1,
  },
});
