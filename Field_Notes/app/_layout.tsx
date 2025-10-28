import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Pliki/Galeria' }} />
        <Stack.Screen name="files" options={{title: 'Lista Plików' }} />
        <Stack.Screen name="gallery" options={{title: 'Galeria Upload'}} />
        <Stack.Screen name="file" options={{title: 'Pliki Upload'}} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
