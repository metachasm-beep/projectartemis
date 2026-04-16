import { turso } from '@/lib/turso';

/**
 * 🛰️ SOVEREIGN PUSH SERVICE
 * Orchestrates the browser-to-protocol notification handshake.
 */
export const PushService = {
  // Public Key previously generated
  VAPID_PUBLIC_KEY: 'BLyvMnDTZGOX0zyA5PNsk3IO1VpjJkfH0NIR4Gs7_id_uYQelQAhRo5ACw9V4YU8UGFy7RGw7a6YAjGdbqknD4o',

  /**
   * 🛡️ PERMISSION_RITUAL: Request or verify notification authority.
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('PUSH_PROTOCOL: Browser does not support notifications.');
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('PUSH_PROTOCOL: Authority granted.');
    }
    return permission;
  },

  /**
   * 🔗 RESONANCE_SYNC: Subscribe the user and store the token in the registry.
   */
  async subscribeUser(userId: string) {
    if (!('serviceWorker' in navigator)) return null;

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(this.VAPID_PUBLIC_KEY)
        });
      }

      // Sync to registry
      await turso.execute({
        sql: `INSERT OR REPLACE INTO push_subscriptions (user_id, subscription_json, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)`,
        args: [userId, JSON.stringify(subscription)]
      });

      console.log('PUSH_PROTOCOL: Resonance established with registry.');
      return subscription;
    } catch (err) {
      console.error('PUSH_PROTOCOL_FAILURE:', err);
      return null;
    }
  },

  /**
   * 🛠️ UTILITY: Convert VAPID key to buffer.
   */
  urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
};
