// Documentation - capacitor App

// To open XCode - the ios development environment - use "npx cap open ios" in terminal
// To open AndroidStudio - the android development environment - use "npx cap open android" in terminal
// To synchronize current changes in the code with the app use "npx cap sync" or "npm run syncApp"

// With XCode it's possible to run the app on an ios emulator or with a real ios device.
// It's possible to debug the real device with safari - therefore you have to go to developer > Your devices name. There you can choose your device

// With AndroidStudio it's possible to run the app on an android emulator or with a real android device.
// It's possible to debug the real device with Google Chrome - therefore you have to go to "chrome://inspect/#devices". There you can inspect your device

// To test the project locally, the proxy must also be started
// In Addition to that it's important that your device and your computer are on the same network
// You have to adjust the IP Adress to your networks IP adress in the .env file and on the url parameter in this config file

import { CapacitorConfig } from '@capacitor/cli';
require('dotenv').config();

const config: CapacitorConfig = {
	appId: process.env.APP_ID,
	appName: process.env.APP_NAME,
	bundledWebRuntime: false,
	webDir: './build',
	plugins: {
		SplashScreen: {
			launchShowDuration: 0,
			androidScaleType: 'CENTER_CROP'
		}
	},
	server: {
		hostname: process.env.APP_HOSTNAME,
		androidScheme: 'https',
		iosScheme: 'https',

		// For testing on a local device or an emulator add your own IP adress with the port here
		// Please note that for testing with a local device your device and your computer have to be connected to the same Network
		url: 'http://x.x.x.x:9000',

		// To use the app in production use the url of your web application
		// url: process.env.APP_URL

		cleartext: true
	},
	cordova: {}
};

export default config;
