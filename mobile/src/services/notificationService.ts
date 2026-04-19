import { Platform, Alert } from 'react-native';
// import * as Notifications from 'expo-notifications'; // Temporarily disabled for immediate demo stability

/**
 * NotificationService: Manages push tokens and local/mock notification triggers.
 * Designed to provide a high-trust, interactive experience for Matriarch users.
 */
export const NotificationService = {
  /**
   * Request permissions and get the push token.
   * In local/web dev, this will handle graceful fallbacks.
   */
  requestPermissions: async () => {
    console.log('Push Notifications: Permission requested (Simulation).');
    return "demo-token-123";
  },

  /**
   * Triggers a local/mock notification using Alert.alert for demo visibility.
   */
  triggerLocalNotification: async (title: string, body: string, data: any = {}) => {
    console.log(`Notification Triggered: ${title} - ${body}`);
    if (Platform.OS === 'web') {
      alert(`${title}\n\n${body}`);
    } else {
      Alert.alert(title, body);
    }
  },

  /**
   * Specifically triggers the "Match" notification for the demo.
   */
  simulateMatchNotification: async () => {
    console.log('Simulating Match Notification...');
    setTimeout(async () => {
      await NotificationService.triggerLocalNotification(
        "♛ NEW SELECTION", 
        "An Elite member has selected your profile for a connection. View status now.",
        { type: 'match', screen: 'Dashboard' }
      );
    }, 3000); // 3-second delay for dramatic effect in demo
  }
};
