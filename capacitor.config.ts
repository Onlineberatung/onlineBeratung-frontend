import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.caritas.onlineberatung.app',
  appName: 'Caritas Online-Beratung',
  webDir: './build',
  bundledWebRuntime: false,
  server: {
    url: "https://diakonie-dev.virtual-identity.com/",
    cleartext: true
}
};

export default config;
