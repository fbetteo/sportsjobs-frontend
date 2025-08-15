// Global type declarations

declare module 'sparkloop' {
    const sparkloop: (teamId: string, opts?: Record<string, any>) => void;
    export default sparkloop;
}

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event',
      targetId: string,
      config?: any
    ) => void;
    dataLayer: any[];
    SL?: {
      trackSubscriber: (email: string) => void;
    };
  }
}

export {};

