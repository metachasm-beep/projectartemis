import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';
import { OBSIDIAN } from './src/constants/theme';

/**
 * Matriarch App Root
 * Now using the modularized RootNavigator and global theme constants.
 */
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor={OBSIDIAN} />
      <RootNavigator />
    </GestureHandlerRootView>
  );
}
