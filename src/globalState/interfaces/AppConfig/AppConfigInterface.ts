import { AppConfigJitsiInterface } from './AppConfigJitsiInterface';
import { AppConfigNotificationsInterface } from './AppConfigNotificationsInterface';
import { AppConfigTwoFactorInterface } from './AppConfigTwoFactorInterface';
import { AppConfigUrlsInterface } from './AppConfigUrlsInterface';
import { AppSettingsInterface } from './AppSettingsInterface';
import { LegalLinkInterface } from '../LegalLinkInterface';
import { InitOptions } from 'i18next';
import { OverlaysConfigInterface } from './OverlaysConfigInterface';
import { TranslationConfig } from '../TranslationConfig';
import { GroupChatConfig } from '../GroupChatConfig';
import { SessionUserDataInterface } from '../SessionsDataInterface';

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
	translation?: TranslationConfig;
	requestCollector?: {
		limit?: number;
		showCorrelationId?: {
			consultant?: boolean;
			user?: boolean;
			other?: boolean;
		};
	};
	groupChat?: GroupChatConfig;
	registration?: {
		directlink?: {
			fallbackLoader?: {
				enabled?: boolean;
			};
		};
	};
	user?: {
		profile?: {
			visibleOnEnquiry:
				| boolean
				| ((sessionUserData: SessionUserDataInterface) => boolean);
		};
	};
}

interface ReleaseToggles {
	enableNewNotifications?: boolean;
	featureVideoGroupChatsEnabled?: boolean;
}
