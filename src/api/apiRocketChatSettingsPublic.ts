import { endpoints } from '../resources/scripts/endpoints';
import { fetchRCData } from './fetchRCData';
import { FETCH_METHODS } from './fetchData';

export const SETTING_E2E_ENABLE = 'E2E_Enable';
export const SETTING_MESSAGE_MAXALLOWEDSIZE = 'Message_MaxAllowedSize';
export const SETTING_FILEUPLOAD_MAXFILESIZE = 'FileUpload_MaxFileSize';
export const SETTING_MESSAGE_ALLOWDELETING = 'Message_AllowDeleting';
export const SETTING_HIDE_SYSTEM_MESSAGES = 'Hide_System_Messages';

export type TSetting =
	| IStringSetting
	| INumberSetting
	| IBooleanSetting
	| IArraySetting;

export interface IStringSetting {
	_id: never;
	enterprise: boolean;
	value: string;
}

export interface INumberSetting {
	_id:
		| typeof SETTING_MESSAGE_MAXALLOWEDSIZE
		| typeof SETTING_FILEUPLOAD_MAXFILESIZE;
	enterprise: boolean;
	value: number;
}

export interface IBooleanSetting {
	_id: typeof SETTING_E2E_ENABLE | typeof SETTING_MESSAGE_ALLOWDELETING;
	enterprise: boolean;
	value: boolean;
}

export interface IArraySetting {
	_id: typeof SETTING_HIDE_SYSTEM_MESSAGES;
	enterprise: boolean;
	value: any[];
}

type TRocketChatSettingsPublicResponse = {
	count: number;
	offset: number;
	total: number;
	success: boolean;
	settings: TSetting[];
};

export const apiRocketChatSettingsPublic = async (
	settingsEntries: string[] = null
): Promise<TRocketChatSettingsPublicResponse> => {
	const url = endpoints.rc.settings.public;
	const query = settingsEntries
		? '?query=' + JSON.stringify({ _id: { $in: settingsEntries } })
		: '';
	return fetchRCData(url + query, FETCH_METHODS.GET);
};
