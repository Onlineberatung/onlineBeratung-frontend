import React, { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	InputField,
	InputFieldItem,
	InputFieldLabelState
} from '../../../inputField/InputField';
import {
	Overlay,
	OverlayItem,
	OVERLAY_FUNCTIONS
} from '../../../overlay/Overlay';
import { EnvelopeIcon } from '../../../../resources/img/icons';
import { BUTTON_TYPES } from '../../../button/Button';
import { isStringValidEmail } from '../../../registration/registrationHelpers';
import { NotificationsContext } from '../../../../globalState';
import { Text } from '../../../text/Text';
import { useUserMutate } from '../../../../hooks/useUserMutate';
import { FETCH_ERRORS, X_REASON } from '../../../../api';

export const SetEmailModal = ({ onClose }) => {
	const { t } = useTranslation();
	const [email, setEmail] = useState<string>('');
	const [emailLabel, setEmailLabel] = useState<string>(
		t('profile.notifications.noEmail.modal.emailInput.label')
	);
	const [emailLabelState, setEmailLabelState] =
		useState<InputFieldLabelState>();
	const { addNotification } = useContext(NotificationsContext);

	const { loading, mutate } = useUserMutate({
		onSuccess: onClose,
		onError: (error: Error | Response) => {
			if (error instanceof Response && error.status === 409) {
				const reason = error.headers?.get(FETCH_ERRORS.X_REASON);
				if (reason === X_REASON.EMAIL_NOT_AVAILABLE) {
					setEmailLabel(
						t(
							'profile.notifications.noEmail.modal.emailInput.unavailable'
						)
					);
					setEmailLabelState('invalid');
					return;
				}
			}

			addNotification({
				title: t('profile.notifications.noEmail.modal.errorTitle'),
				text: t('profile.notifications.noEmail.modal.errorMessage'),
				notificationType: 'error'
			});
		}
	});

	const emailInputItem: InputFieldItem = {
		content: email,
		icon: <EnvelopeIcon />,
		id: 'email',
		label: emailLabel,
		name: 'email',
		type: 'text',
		labelState: emailLabelState
	};

	const validateEmail = useCallback(
		(email): { validity: InputFieldLabelState; label: string } => {
			if (email.length > 0 && isStringValidEmail(email)) {
				return {
					validity: 'valid',
					label: t(
						'profile.notifications.noEmail.modal.emailInput.valid'
					)
				};
			} else if (email.length > 0) {
				return {
					validity: 'invalid',
					label: t(
						'profile.notifications.noEmail.modal.emailInput.invalid'
					)
				};
			} else {
				return {
					validity: null,
					label: t(
						'profile.notifications.noEmail.modal.emailInput.label'
					)
				};
			}
		},
		[t]
	);

	const handleEmailChange = useCallback(
		(event) => {
			const validityData = validateEmail(event.target.value);
			setEmailLabelState(validityData.validity);
			setEmailLabel(validityData.label);
			setEmail(event.target.value);
		},
		[validateEmail]
	);

	const handleOverlayAction = useCallback(
		(buttonFunction: string) => {
			if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
				onClose();
			} else {
				mutate({ email });
			}
		},
		[email, mutate, onClose]
	);

	const emailOverlayItem: OverlayItem = {
		buttonSet: [
			{
				disabled: false,
				label: t('profile.notifications.noEmail.modal.confirm'),
				type: BUTTON_TYPES.PRIMARY
			}
		],
		headline: t('profile.notifications.noEmail.modal.title'),
		headlineStyleLevel: '4',
		nestedComponent: (
			<>
				<Text
					type="infoMedium"
					text={t('profile.notifications.noEmail.modal.description')}
				/>
				<InputField
					item={emailInputItem}
					inputHandle={(e) => handleEmailChange(e)}
				/>
			</>
		)
	};

	return (
		<Overlay
			loading={loading}
			item={emailOverlayItem}
			handleOverlay={handleOverlayAction}
			handleOverlayClose={onClose}
		/>
	);
};
