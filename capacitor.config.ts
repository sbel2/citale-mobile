import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "com.citaleco.app",
  appName: "Citale",
  server: {
    url: "https://citaleco.com", // ✅ Load directly from your live website
    cleartext: true
  }
};

export default config;
