import { useEffect, useState } from 'react';
import { Headline } from '../../../../components/headline/Headline';
import { Text } from '../../../../components/text/Text';
import { AssignedCalendars } from '../AssignedCalendars/assignedCalendars';
import AddCalendar from '../AddCalendar/addCalendar';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '../../../../components/box/Box';
import { useAppConfig } from '../../../../hooks/useAppConfig';

export const CalendarIntegration = () => {
	const { t: translate } = useTranslation();

	const [selectedTab, setSelectedTab] = useState(null);
	const [showSynchronizedTab, setShowSynchronizedTab] = useState(false);
	const settings = useAppConfig();

	useEffect(() => {
		fetch(`${settings.calcomUrl}/api/trpc/viewer.connectedCalendars`, {
			credentials: 'include'
		})
			.then((resp) => resp.json())
			.then((data) => {
				if (data.result.data.json.connectedCalendars.length > 0) {
					setShowSynchronizedTab(true);
					setSelectedTab('synchronized');
				} else {
					setSelectedTab('addNew');
				}
			});
	}, [settings.calcomUrl]);

	return (
		<Box>
			<div style={{ marginBottom: '20px' }}>
				<Headline
					className="pr--3"
					text={translate(
						'booking.calender.synchroniseCalender.title'
					)}
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
		</Box>
	);
};
