import * as React from 'react';
import { useContext, useEffect } from 'react';
import {
	setBookingWrapperActive,
	setBookingWrapperInactive
} from '../app/navigationHandler';
import { UserDataContext } from '../../globalState';
import { fetchData } from '../../api';
import { config } from '../../resources/scripts/config';

//TODO: this is only for testing
export const MySchedule = () => {
	const { userData, setUserData } = useContext(UserDataContext);

	useEffect(() => {
		setBookingWrapperActive();

		fetch(config.endpoints.counselorToken(userData.userId))
			.then((resp) => resp.json())
			.then((data) => {
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
									'accept': '*/*',
									'accept-language': 'en-GB,en;q=0.9',
									'content-type':
										'application/x-www-form-urlencoded',
									'sec-ch-ua':
										'" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
									'sec-ch-ua-mobile': '?0',
									'sec-ch-ua-platform': '"Linux"',
									'sec-fetch-dest': 'empty',
									'sec-fetch-mode': 'cors',
									'sec-fetch-site': 'same-origin'
								},
								referrer:
									'https://calcom-develop.suchtberatung.digital/auth/login',
								referrerPolicy:
									'strict-origin-when-cross-origin',
								body: `csrfToken=${data.csrfToken}&email=${userData.email}&password=${data.token}&callbackUrl=https%3A%2F%2Fcalcom-develop.suchtberatung.digital%2F&redirect=false&json=true`,
								method: 'POST',
								mode: 'cors',
								credentials: 'include'
							}
						);
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
		<div style={{ height: '100%' }}>
			<div
				style={{
					display: 'flex',
					columnGap: '20px',
					paddingLeft: '30px',
					lineHeight: '40px'
				}}
			>
				<span onClick={() => syncCalendar('google')}>Google</span>
				<span onClick={() => syncCalendar('office365')}>Office365</span>
				<span onClick={() => syncCalendar('caldav')}>CalDav</span>
				<span onClick={() => syncCalendar('apple')}>Apple</span>
			</div>
			<iframe
				id={'test123'}
				src={'https://calcom-develop.suchtberatung.digital/auth/login'}
				frameBorder={0}
				scrolling="false"
				width="100%"
				height="100%"
				title="booking-cancellation"
			/>
		</div>
	);
};
