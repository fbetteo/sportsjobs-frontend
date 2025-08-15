// Global type declarations

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: any
    ) => void;
    dataLayer: any[];
  }
}

export {};
