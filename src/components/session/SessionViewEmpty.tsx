import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { mobileListView } from '../app/navigationHandler';
import './session.styles';
import { ReactComponent as SelectMessageIllustration } from '../../resources/img/illustrations/select-message.svg';
import { ListInfo } from '../listInfo/ListInfo';

export const SessionViewEmpty = () => {
	const { t: translate } = useTranslation();
	useEffect(() => {
		mobileListView();
	}, []);
	return (
		<div className="session session--empty">
			<ListInfo
				headline={translate('session.empty')}
				Illustration={SelectMessageIllustration}
			></ListInfo>
		</div>
	);
};
