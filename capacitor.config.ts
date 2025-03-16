import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "com.citaleco.app",
  appName: "Citale",
  server: {
    url: "http://10.0.0.93:3000", // ✅ Change to HTTP for development
    cleartext: true
  },
};

export default config;
