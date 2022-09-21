import { AppConfigEndpointsInterface } from './AppConfigEndpointsInterface';
import { AppConfigJitsiInterface } from './AppConfigJitsiInterface';
import { AppConfigNotificationsInterface } from './AppConfigNotificationsInterface';
import { AppConfigTwoFactorInterface } from './AppConfigTwoFactorInterface';
import { AppConfigUrlsInterface } from './AppConfigUrlsInterface';
import { AppSettingsInterface } from './AppSettingsInterface';

export interface AppConfigInterface extends AppSettingsInterface {
	endpoints: AppConfigEndpointsInterface;
	urls: AppConfigUrlsInterface;
	postcodeFallbackUrl: string;
	jitsi: AppConfigJitsiInterface;
	emails: AppConfigNotificationsInterface;
	twofactor: AppConfigTwoFactorInterface;
}
