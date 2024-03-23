import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.benlyddane.app',
  appName: 'BenLyddane',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
