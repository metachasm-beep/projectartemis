import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Screens
import { SplashScreen } from '../screens/SplashScreen';
import { RoleSelectionScreen } from '../screens/RoleSelectionScreen';
import { AadhaarScreen } from '../screens/AadhaarScreen';
import { DiscoveryScreen } from '../screens/DiscoveryScreen';
import { DashboardScreen } from '../screens/DashboardScreen';

export type RootStackParamList = {
  Splash: undefined;
  RoleSelection: undefined;
  Aadhaar: { nextScreen: 'Discovery' | 'Dashboard' };
  Discovery: undefined;
  Dashboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

/**
 * RootNavigator: The main navigation configuration for MATRIARCH.
 * Handles the flow between splash, role selection, identity verification, and dashboards.
 */
export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#0A0A0A' },
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreenWrapper} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionWrapper} />
        <Stack.Screen name="Aadhaar" component={AadhaarWrapper} />
        <Stack.Screen name="Discovery" component={DiscoveryWrapper} />
        <Stack.Screen name="Dashboard" component={DashboardWrapper} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Wrappers to handle navigation props and pass custom callbacks
const SplashScreenWrapper = ({ navigation }: any) => (
  <SplashScreen onNext={() => navigation.navigate('RoleSelection')} />
);

const RoleSelectionWrapper = ({ navigation }: any) => (
  <RoleSelectionScreen 
    onSelect={(role) => {
      const nextScreen = role === 'woman' ? 'Discovery' : 'Dashboard';
      navigation.navigate('Aadhaar', { nextScreen });
    }} 
  />
);

const AadhaarWrapper = ({ navigation, route }: any) => (
  <AadhaarScreen 
    onVerify={() => navigation.replace(route.params.nextScreen)}
    onBack={() => navigation.goBack()}
  />
);

const DiscoveryWrapper = ({ navigation }: any) => (
  <DiscoveryScreen onBack={() => navigation.goBack()} />
);

const DashboardWrapper = ({ navigation }: any) => (
  <DashboardScreen 
    onBack={() => navigation.goBack()} 
    onVerify={() => navigation.navigate('Aadhaar', { nextScreen: 'Dashboard' })}
  />
);
