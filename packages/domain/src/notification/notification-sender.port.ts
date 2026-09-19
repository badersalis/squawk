import type { Notification } from './notification.js';

/**
 * Port implemented by every notification transport (email, push, etc.).
 * The domain never knows which provider is behind this call.
 */
export interface NotificationSender {
  send(notification: Notification): Promise<void>;
}