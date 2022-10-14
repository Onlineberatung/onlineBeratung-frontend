import React, { useEffect } from 'react';
import {
	setProfileWrapperActive,
	setProfileWrapperInactive
} from '../../components/app/navigationHandler';
import { Page } from '../../components/Page';
import { SESSION_LIST_TYPES } from '../../components/session/sessionHelpers';
import { BookingCard } from './components/BookingCard/BookingCard';
import { EmptyType } from './components/EmptyState';
import { SessionCard } from './components/SessionCard/SessionCard';
import './overview.styles.scss';
import { useTranslation } from 'react-i18next';

export const OverviewPage = () => {
	const { t: translate } = useTranslation();

	useEffect(() => {
		setProfileWrapperActive();
		return () => {
			setProfileWrapperInactive();
		};
	}, []);

	return (
		<Page className="overviewPage">
			<Page.Title>{translate('overview.title')}</Page.Title>

			<div className="overviewPage__cardGroup">
				<SessionCard
					title="overview.myMessagesTitle"
					type={SESSION_LIST_TYPES.MY_SESSION}
					allMessagesPaths="/sessions/consultant/sessionView"
					emptyType={EmptyType.Checkmark}
				/>

				<SessionCard
					title="overview.initialInquiriesTitle"
					type={SESSION_LIST_TYPES.ENQUIRY}
					allMessagesPaths="/sessions/consultant/sessionPreview"
					emptyType={EmptyType.MailIcon}
				/>

				<BookingCard />
			</div>
		</Page>
	);
};
