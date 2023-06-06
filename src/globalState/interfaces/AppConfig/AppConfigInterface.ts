import { AppConfigJitsiInterface } from './AppConfigJitsiInterface';
import { AppConfigNotificationsInterface } from './AppConfigNotificationsInterface';
import { AppConfigTwoFactorInterface } from './AppConfigTwoFactorInterface';
import { AppConfigUrlsInterface } from './AppConfigUrlsInterface';
import { AppSettingsInterface } from './AppSettingsInterface';
import { LegalLinkInterface } from '../LegalLinkInterface';
import { InitOptions } from 'i18next';
import { OverlaysConfigInterface } from './OverlaysConfigInterface';

export interface AppConfigInterface extends AppSettingsInterface {
	urls: AppConfigUrlsInterface;
	legalLinks: LegalLinkInterface[];
	postcodeFallbackUrl: string;
	spokenLanguages: string[];
	jitsi: AppConfigJitsiInterface;
	emails: AppConfigNotificationsInterface;
	twofactor: AppConfigTwoFactorInterface;
	i18n: InitOptions;
	overlays?: OverlaysConfigInterface;
	releaseToggles?: ReleaseToggles;
	requestCollector?: {
		limit?: number;
		showCorrelationId?: {
			consultant?: boolean;
			user?: boolean;
			other?: boolean;
		};
	};
}

interface ReleaseToggles {
	enableNewNotifications?: boolean;
	featureVideoGroupChatsEnabled?: boolean;
}
