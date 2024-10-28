import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.skimatch.app',
  appName: 'SkiMatch',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
