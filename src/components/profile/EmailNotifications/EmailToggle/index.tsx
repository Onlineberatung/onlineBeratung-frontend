import React, { useCallback, useContext, useEffect, useState } from 'react';
import clone from 'lodash/clone';
import get from 'lodash/get';
import set from 'lodash/set';
import { NotificationsContext, UserDataContext } from '../../../../globalState';
import { useUserMutate } from '../../../../hooks/useUserMutate';
import { Switch } from '../../../Switch';
import { useTranslation } from 'react-i18next';

interface EmailToggleProps {
	name: string;
	titleKey: string;
	descriptionKey?: string;
}

export const EmailToggle = ({
	name,
	titleKey,
	descriptionKey
}: EmailToggleProps) => {
	const { t } = useTranslation();
	const { userData } = useContext(UserDataContext);
	const [internalChecked, setInternalChecked] = useState(false);
	const { addNotification } = useContext(NotificationsContext);

	const { mutate } = useUserMutate({
		onError: (ex) => {
			addNotification({
				title: t('profile.notifications.toggleError.title'),
				text: t('profile.notifications.toggleError.description'),
				notificationType: 'error'
			});
			console.error(ex);
		}
	});

	useEffect(() => {
		const checked = get(userData?.emailNotifications, name, false);
		setInternalChecked(checked);
	}, [userData.emailNotifications, name]);

	const onChange = useCallback(
		(checked) => {
			setInternalChecked(checked);
			const emailNotifications = set(
				clone(userData.emailNotifications),
				name,
				checked
			);
			mutate({ emailNotifications });
		},
		[mutate, name, userData.emailNotifications]
	);

	return (
		<Switch
			titleKey={titleKey}
			descriptionKey={descriptionKey}
			onChange={onChange}
			checked={internalChecked}
		/>
	);
};
