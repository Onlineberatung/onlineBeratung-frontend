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
		url: 'http://localhost:9000',
		cleartext: true
	},
	cordova: {}
};

export default config;
