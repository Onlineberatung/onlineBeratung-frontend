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

		// For testing on a local device or an emulator add your own IP adress with the port here
		// Please note that for testing with a local device your device and your computer have to be connected to the same Network
		url: 'http://x.x.x.x:9000',

		// To use the app in production use the url of your web application
		// url: 'https://beratung.caritas.de/',

		cleartext: true
	},
	cordova: {}
};

export default config;
