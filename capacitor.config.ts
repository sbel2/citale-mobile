import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "com.citaleco.app",
  appName: "Citale",
  webDir: "out", // Use the exported Next.js static files
  server: {
    androidScheme: "https",
  },
};

export default config;
