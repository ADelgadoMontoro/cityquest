import { MobileRootProviders } from '@/bootstrap/MobileRootProviders';
import { AppNavigator } from '@/navigation/AppNavigator';
import { useAppReady } from '@/hooks/useAppReady';

export function AppRoot(): React.JSX.Element {
  const isAppReady = useAppReady();

  if (!isAppReady) {
    return <></>;
  }

  return (
    <MobileRootProviders>
      <AppNavigator />
    </MobileRootProviders>
  );
}
