// Auto-mock for firebase module - prevents test hangs from Firebase SDK initialization
export const requestNotificationPermission = () => Promise.resolve(null);
export const messaging = null;
export default {};
