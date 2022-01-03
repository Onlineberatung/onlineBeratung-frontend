import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'de.caritas.onlineberatung.app',
	appName: 'Caritas Online-Beratung',
	bundledWebRuntime: false,
	webDir: './build',
	plugins: {
		SplashScreen: {
			launchShowDuration: 0,
			androidScaleType: 'CENTER_CROP'
		}
	},
	server: {
		hostname: 'caritas-dev.virtual-identity.com',
		androidScheme: 'https',
		iosScheme: 'https',
		url: 'http://10.1.11.73:9000',
		// url: 'https://caritas-dev.virtual-identity.com/',
		cleartext: true
	},
	cordova: {}
};

export default config;
