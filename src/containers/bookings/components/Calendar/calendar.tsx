import { Button } from '../../../../components/button/Button';
import * as React from 'react';
import { useAppConfig } from '../../../../hooks/useAppConfig';
import { ReactNode, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface AvailableCalendarsProps {
	buttonLabelKey: string;
	calendarName: string;
	children: ReactNode;
	labelKey: string;
}

export const Calendar: React.FC<AvailableCalendarsProps> = ({
	buttonLabelKey,
	calendarName,
	children,
	labelKey
}) => {
	const { t: translate } = useTranslation();
	const settings = useAppConfig();

	const syncCalendar = useCallback(
		(calendarName: string) => {
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
		},
		[settings.calcomUrl]
	);

	return (
		<div className="calendar-integration-container">
			{children}
			<div className="calendar-integration-item-container">
				<span>{translate(labelKey)}</span>
				<Button
					item={{
						type: 'TERTIARY',
						label: `${translate(buttonLabelKey)}`
					}}
					buttonHandle={() => syncCalendar(calendarName)}
				/>
			</div>
		</div>
	);
};
