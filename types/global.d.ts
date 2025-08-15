// Global type declarations

// Sparkloop module declaration
declare module 'sparkloop' {
  const sparkloop: any;
  export default sparkloop;
}

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
