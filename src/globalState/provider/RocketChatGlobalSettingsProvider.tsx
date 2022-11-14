import * as React from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';
import {
	apiRocketChatSettingsPublic,
	ISetting,
	SETTING_E2E_ENABLE,
	SETTING_FILEUPLOAD_MAXFILESIZE,
	SETTING_MESSAGE_ALLOWDELETING,
	SETTING_MESSAGE_MAXALLOWEDSIZE
} from '../../api/apiRocketChatSettingsPublic';
import { INPUT_MAX_LENGTH } from '../../components/messageSubmitInterface/richtextHelpers';
import {
	ENCRYPTION_VERSION_ACTIVE,
	KEY_ID_LENGTH,
	MAX_PREFIX_LENGTH,
	VECTOR_LENGTH,
	VERSION_SEPERATOR
} from '../../utils/encryptionHelpers';
import { apiPostError, ERROR_LEVEL_WARN } from '../../api/apiPostError';
import { ATTACHMENT_MAX_SIZE_IN_MB } from '../../components/messageSubmitInterface/attachmentHelpers';
import { appConfig } from '../../utils/appConfig';

const SETTINGS_TO_FETCH = [
	SETTING_E2E_ENABLE,
	SETTING_MESSAGE_MAXALLOWEDSIZE,
	SETTING_FILEUPLOAD_MAXFILESIZE,
	SETTING_MESSAGE_ALLOWDELETING
];

type RocketChatGlobalSettingsContextProps = {
	settings: ISetting[];
	getSetting: (id: string) => ISetting | null;
};

export const RocketChatGlobalSettingsContext =
	createContext<RocketChatGlobalSettingsContextProps>(null);

export const RocketChatGlobalSettingsProvider = (props) => {
	const [settings, setSettings] = useState<ISetting[]>([]);

	useEffect(() => {
		apiRocketChatSettingsPublic(SETTINGS_TO_FETCH).then((res) =>
			setSettings(res.settings)
		);
	}, []);

	const getSetting = useCallback(
		(id: string) => settings.find((s) => s._id === id) ?? null,
		[settings]
	);

	// Check rc configured message length
	useEffect(() => {
		if (settings.length <= 0) {
			return;
		}
		const isE2eeEnabled = getSetting(SETTING_E2E_ENABLE)?.value ?? false;
		const configuredInputMaxLength =
			getSetting(SETTING_MESSAGE_MAXALLOWEDSIZE)?.value ?? 0;
		const configuredAttachmentMaxFilesize =
			getSetting(SETTING_FILEUPLOAD_MAXFILESIZE)?.value ?? 0;

		let requiredInputMaxLength = INPUT_MAX_LENGTH;

		if (isE2eeEnabled) {
			// Calculate required size plus 100 signs as extra space
			requiredInputMaxLength =
				(requiredInputMaxLength + VECTOR_LENGTH * 2) * 2 +
				KEY_ID_LENGTH +
				MAX_PREFIX_LENGTH +
				VERSION_SEPERATOR.length +
				ENCRYPTION_VERSION_ACTIVE.length +
				100;
		}

		if (configuredInputMaxLength < requiredInputMaxLength) {
			console.error(
				'Max allowed input length is configured too short in RC!'
			);
			apiPostError({
				name: 'MessageMaxAllowedSize',
				message: `Max allowed input length is configured too short in RC! Configured: ${configuredInputMaxLength} Required: ${requiredInputMaxLength}`,
				level: ERROR_LEVEL_WARN
			}).then();
		}

		let requiredAttachmentMaxSize = ATTACHMENT_MAX_SIZE_IN_MB;

		if (isE2eeEnabled && appConfig.attachmentEncryption) {
			// Calculate required size plus 100 signs as extra space
			requiredAttachmentMaxSize =
				(requiredAttachmentMaxSize * 1024 * 1024 + VECTOR_LENGTH * 2) *
					2 +
				KEY_ID_LENGTH +
				MAX_PREFIX_LENGTH +
				VERSION_SEPERATOR.length +
				ENCRYPTION_VERSION_ACTIVE.length +
				100;
		}

		if (
			configuredAttachmentMaxFilesize === 0 ||
			configuredAttachmentMaxFilesize / 1024 / 1024 <
				requiredAttachmentMaxSize
		) {
			console.error(
				'Max allowed upload filesize is configured too small in RC!'
			);
			apiPostError({
				name: 'FileUploadMaxFileSize',
				message: `Max allowed upload filesize is configured too small in RC! Configured: ${
					configuredAttachmentMaxFilesize === 0
						? 0
						: Math.ceil(
								configuredAttachmentMaxFilesize / 1024 / 1024
						  )
				} Required: ${Math.ceil(
					requiredAttachmentMaxSize / 1024 / 1024
				)}`,
				level: ERROR_LEVEL_WARN
			}).then();
		}
	}, [getSetting, settings.length]);

	return (
		<RocketChatGlobalSettingsContext.Provider
			value={{ settings, getSetting }}
		>
			{props.children}
		</RocketChatGlobalSettingsContext.Provider>
	);
};
