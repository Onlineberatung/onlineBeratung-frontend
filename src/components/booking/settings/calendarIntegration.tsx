import { useEffect, useState } from 'react';
import { config } from '../../../resources/scripts/config';
import { Headline } from '../../headline/Headline';
import { Text } from '../../text/Text';
import AssignedCalendars from './assignedCalendars';
import AddCalendar from './addCalendar';
import * as React from 'react';
import { translate } from '../../../utils/translate';

export const CalendarIntegration = () => {
	const [selectedTab, setSelectedTab] = useState(null);
	const [showSynchronizedTab, setShowSynchronizedTab] = useState(false);

	useEffect(() => {
		fetch(
			`${config.urls.appointmentServiceDevServer}/api/trpc/viewer.connectedCalendars`,
			{ credentials: 'include' }
		)
			.then((resp) => resp.json())
			.then((data) => {
				if (data.result.data.json.connectedCalendars.length > 0) {
					setShowSynchronizedTab(true);
					setSelectedTab('synchronized');
				} else {
					setSelectedTab('addNew');
				}
			});
	}, []);

	return (
		<div className="settings-container-column">
			<div style={{ marginBottom: '20px' }}>
				<Headline
					className="pr--3"
					text={translate('booking.calender.synchroniseCalender')}
					semanticLevel="5"
				/>
			</div>
			<div style={{ marginBottom: '20px' }}>
				<Text
					text={translate(
						'booking.calender.synchroniseCalender.description'
					)}
					type="standard"
					className="tertiary"
				/>
			</div>
			{selectedTab && (
				<div
					style={{ display: 'flex' }}
					className="bookingEvents__nav text--nowrap flex__col--no-grow"
				>
					{showSynchronizedTab && (
						<button
							className={
								selectedTab === 'synchronized'
									? 'navigation-button-active'
									: 'navigation-button'
							}
							onClick={() => setSelectedTab('synchronized')}
							style={{ display: 'flex', marginRight: '20px' }}
						>
							{translate(
								'booking.calender.synchronised.calendars'
							)}
						</button>
					)}
					<button
						className={
							selectedTab === 'addNew'
								? 'navigation-button-active'
								: 'navigation-button'
						}
						onClick={() => setSelectedTab('addNew')}
					>
						{translate('booking.calender.add')}
					</button>
				</div>
			)}
			{selectedTab === 'synchronized' ? <AssignedCalendars /> : null}
			{selectedTab === 'addNew' ? <AddCalendar /> : null}
		</div>
	);
};
