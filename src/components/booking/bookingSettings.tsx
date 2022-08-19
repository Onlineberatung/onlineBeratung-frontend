import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../app/navigationHandler';
import { UserDataContext } from '../../globalState';
import { config } from '../../resources/scripts/config';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';

//TODO: this is only for testing
export const BookingSettings = () => {
	const { userData, setUserData } = useContext(UserDataContext);
	const [url, setUrl] = useState('');

	useEffect(() => {
		setBookingWrapperActive();

		fetch(config.endpoints.counselorToken(userData.userId))
			.then((resp) => resp.json())
			.then((tokenResponse) => {
				fetch(
					'https://calcom-develop.suchtberatung.digital/api/auth/csrf',
					{ credentials: 'include' }
				)
					.then((resp) => resp.json())
					.then((data) => {
						fetch(
							'https://calcom-develop.suchtberatung.digital/api/auth/callback/credentials?',
							{
								headers: {
									'content-type':
										'application/x-www-form-urlencoded'
								},
								body: `csrfToken=${data.csrfToken}&email=${userData.email}&password=${tokenResponse.token}&callbackUrl=https%3A%2F%2Fcalcom-develop.suchtberatung.digital%2F&redirect=false&json=true`,
								method: 'POST',
								credentials: 'include'
							}
						).then(() => {
							setUrl(
								'https://calcom-develop.suchtberatung.digital/availability'
							);
						});
					});
			});
		return () => {
			setBookingWrapperInactive();
		};
	}, []);

	function syncCalendar(calendarName: string) {
		if (calendarName === 'apple' || calendarName === 'caldav') {
			window.open(
				`https://calcom-develop.suchtberatung.digital/apps/${calendarName}-calendar/setup`
			);
			return;
		}

		fetch(
			`https://calcom-develop.suchtberatung.digital/api/integrations/${calendarName}_calendar/add`
		)
			.then((resp) => resp.json())
			.then((resp) => {
				window.open(resp.url, '_blank');
			});
	}

	return (
		<div
			style={{
				height: '800px',
				display: 'flex',
				columnGap: '40px'
			}}
		>
			<div
				style={{
					height: '100%',
					width: '50%',
					backgroundColor: '#FEFEFE',
					padding: '20px 0 0 20px'
				}}
			>
				<div style={{ marginBottom: '20px' }}>
					<Headline
						className="pr--3"
						text={'Ihre Verfügbarkeit'}
						semanticLevel="5"
					/>
				</div>
				<div style={{ marginBottom: '20px' }}>
					<Text
						text={
							'Geben Sie hier Ihre allegemeine Verfügbarkeit an, damit Ratsuchende Termine bei Ihnen buchen können.'
						}
						type="standard"
						className="tertiary"
					/>
				</div>

				<iframe
					src={url}
					frameBorder={0}
					scrolling="false"
					width="100%"
					height="80%"
					title="booking-cancellation"
				/>
			</div>
			<div style={{ backgroundColor: '#FEFEFE', width: '50%' }}>
				<div onClick={() => syncCalendar('office365')}>
					Office 365/ Outlook Kalender
				</div>
				<div onClick={() => syncCalendar('caldav')}>
					CalDav Server Kalender
				</div>
				<div onClick={() => syncCalendar('google')}>
					Google Kalender
				</div>
				<div onClick={() => syncCalendar('apple')}>Apple Kalender</div>
			</div>
		</div>
	);
};
