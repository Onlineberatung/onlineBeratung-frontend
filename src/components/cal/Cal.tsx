/* eslint-disable prefer-const */
import React, { useContext, useEffect, useRef } from 'react';
import useEmbed from './useEmbed';
import './cal.styles';
import { history } from '../app/app';
import { apiAppointmentSuccessfullySet } from '../../api/apiAppointmentSuccessfullySet';
import { UserDataContext } from '../../globalState';
import { translate } from '../../utils/translate';

export default function Cal({
	calLink,
	calOrigin,
	config,
	embedJsUrl
}: {
	calOrigin?: string;
	calLink: string;
	config?: any;
	embedJsUrl?: string;
}) {
	const { userData } = useContext(UserDataContext);

	if (!calLink) {
		throw new Error('calLink is required');
	}
	const initializedRef = useRef(false);
	const Cal = useEmbed(embedJsUrl);
	const ref = useRef<HTMLDivElement>(null);
	const { rcGroupId, sessionId } = history.location.state;

	useEffect(() => {
		if (!Cal || initializedRef.current) {
			return;
		}
		initializedRef.current = true;
		const element = ref.current;
		let initConfig = {
			debug: true
		};
		if (calOrigin) {
			(initConfig as any).origin = calOrigin;
		}
		Cal('init', initConfig);
		Cal('inline', {
			elementOrSelector: element,
			calLink,
			config
		});
		Cal('ui', {
			styles: {
				eventTypeListItem: {
					background: 'red',
					color: 'white',
					backgroundColor: 'red',
					marginBottom: '100px'
				},
				branding: {
					brandColor: '#7fdfc4'
				}
			}
		});
		Cal('on', {
			action: 'bookingSuccessful',
			callback: (e) => {
				const { data } = e.detail;
				const date = data.date;
				const appointmentData = {
					title: data.eventType.title,
					user: userData.userName,
					counselor: data.organizer.name,
					date: date,
					duration: data.duration,
					location: `${data.eventType.title} ${translate(
						'message.appointmentSet.between'
					)} ${data.eventType.team.name} ${translate(
						'message.appointmentSet.and'
					)} ${data.organizer.name}`
				};
				apiAppointmentSuccessfullySet(
					JSON.stringify(appointmentData),
					rcGroupId
				)
					.then(() => {
						history.push({
							pathname: `/sessions/user/view/${rcGroupId}/${sessionId}`
						});
					})
					.catch((error) => {
						console.log(error);
					});
			}
		});
		(window as any).Call = Cal;
	}, [Cal, calLink, config, calOrigin]); // eslint-disable-line react-hooks/exhaustive-deps

	if (!Cal) {
		return <div>Loading {calLink}</div>;
	}

	return <div ref={ref}></div>;
}
