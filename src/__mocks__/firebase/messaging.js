// Auto-mock for firebase/messaging - prevents isSupported() hang in jsdom
export const getMessaging = () => null;
export const getToken = () => Promise.resolve(null);
export const onMessage = () => () => {};
export const isSupported = () => Promise.resolve(false);
