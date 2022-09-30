import { Button } from '../../../../components/button/Button';
import * as React from 'react';
import { useAppConfig } from '../../../../hooks/useAppConfig';
import { ReactElement } from 'react';

interface AvailableCalendarsProps {
	component: ReactElement;
	label: string;
	buttonLabel: string;
	calendarName: string;
}

export const Calendar: React.FC<AvailableCalendarsProps> = ({
	component,
	label,
	buttonLabel,
	calendarName
}) => {
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
		<div className="calendar-integration-container">
			{component}
			<div className="calendar-integration-item-container">
				<span>{label}</span>
				<Button
					item={{
						type: 'TERTIARY',
						label: `${buttonLabel}`
					}}
					buttonHandle={() => syncCalendar(calendarName)}
				/>
			</div>
		</div>
	);
};
