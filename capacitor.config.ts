import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "com.citaleco.app",
  appName: "Citale",
  server: {
    url: "https://citale-mobile.vercel.app", // ✅ Use your deployed mobile site
    cleartext: false // Ensures HTTPS security
  },
  ios: {
    scheme: "https", // Ensures proper SSL handling
    
  },
};

export default config;
