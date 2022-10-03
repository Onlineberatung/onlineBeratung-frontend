import {
	AppleIcon,
	CalDav,
	GoogleCalendar,
	Office365
} from '../../../resources/img/icons';
import { Button } from '../../button/Button';
import * as React from 'react';
import { translate } from '../../../utils/translate';
import { useAppConfig } from '../../../hooks/useAppConfig';

const AddCalendar = () => {
	const settings = useAppConfig();
	const syncCalendar = (calendarName: string) => {
		if (calendarName === 'apple' || calendarName === 'caldav') {
			window.location.replace(
				`${settings.calcomUrl}/apps/${calendarName}-calendar/setup`
			);
			return;
		}

		fetch(
			`${settings.calcomUrl}/api/integrations/${calendarName}_calendar/add?state={"returnTo":"${window.location.origin}/booking/events/settings"}`
		)
			.then((resp) => resp.json())
			.then((resp) => {
				window.location.replace(resp.url);
			});
	};

	return (
		<>
			<div className="calendar-integration-container">
				<Office365 className="calendar-integration-icon" />
				<div className="calendar-integration-item-container">
					<span>
						{translate('booking.calender.integration.office365')}
					</span>
					<Button
						item={{
							type: 'TERTIARY',
							label: `${translate(
								'booking.calender.synchronise'
							)}`
						}}
						buttonHandle={() => syncCalendar('office365')}
					/>
				</div>
			</div>

			<div className="calendar-integration-container">
				<CalDav className="calendar-integration-icon" />
				<div className="calendar-integration-item-container">
					<span>
						{translate('booking.calender.integration.caldav')}
					</span>
					<Button
						item={{
							type: 'TERTIARY',
							label: `${translate(
								'booking.calender.synchronise'
							)}`
						}}
						buttonHandle={() => syncCalendar('caldav')}
					/>
				</div>
			</div>

			<div className="calendar-integration-container">
				<GoogleCalendar className="calendar-integration-icon" />
				<div className="calendar-integration-item-container">
					<span>
						{translate('booking.calender.integration.google')}
					</span>
					<Button
						item={{
							type: 'TERTIARY',
							label: `${translate(
								'booking.calender.synchronise'
							)}`
						}}
						buttonHandle={() => syncCalendar('google')}
					/>
				</div>
			</div>
			<div className="calendar-integration-container">
				<AppleIcon className="calendar-integration-icon" />
				<div className="calendar-integration-item-container">
					<span>
						{translate('booking.calender.integration.apple')}
					</span>
					<Button
						item={{
							type: 'TERTIARY',
							label: `${translate(
								'booking.calender.synchronise'
							)}`
						}}
						buttonHandle={() => syncCalendar('apple')}
					/>
				</div>
			</div>
		</>
	);
};

export default AddCalendar;
