/* eslint-disable prefer-const */
import React, { useContext, useEffect, useRef } from 'react';
import useEmbed from './useEmbed';
import './cal.styles';
import { history } from '../app/app';
import { apiAppointmentSuccessfullySet } from '../../api/apiAppointmentSuccessfullySet';
import { UserDataContext } from '../../globalState';

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
				// body: {
				// 	'background': 'red',
				// 	'background-color': 'red'
				// },
				eventTypeListItem: {
					background: 'red',
					color: 'white',
					backgroundColor: 'red',
					marginBottom: '100px'
				},
				// enabledDateButton: {
				// 	background: 'red',
				// 	color: 'white',
				// 	backgroundColor: 'red'
				// },
				// disabledDateButton: {
				// 	background: 'red',
				// 	color: 'white',
				// 	backgroundColor: 'red'
				// },
				// availabilityDatePicker: {
				// 	background: 'red',
				// 	color: 'white',
				// 	backgroundColor: 'red'
				// },
				branding: {
					brandColor: '#7fdfc4'
					// lightColor: 'orange',
					// lighterColor: 'grey',
					// lightestColor: 'green',
					// highlightColor: 'yellow'
					// darkColor: 'blue',
					// darkerColor: 'blue',
					// medianColor: 'blue'
				}
			}
		});
		Cal('on', {
			action: 'bookingSuccessful',
			callback: (e) => {
				const { data, type, namespace } = e.detail;
				const eventType = data.eventType.id;
				const date = data.date;
				const appointmentData = {
					title: data.eventType.title,
					user: userData.userName,
					counselor: data.organizer.name,
					date: date
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
	}, [Cal, calLink, config, calOrigin]);

	if (!Cal) {
		return <div>Loading {calLink}</div>;
	}

	return <div ref={ref}></div>;
}
