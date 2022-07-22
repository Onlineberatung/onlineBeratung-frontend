/* eslint-disable prefer-const */
import React, { useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import useEmbed from './useEmbed';
import './cal.styles';
import { history } from '../app/app';
import { apiAppointmentServiceSet } from '../../api/apiAppointmentServiceSet';
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
	const location = useLocation();

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
				branding: {
					brandColor: '#7fdfc4'
				}
			}
		});
		Cal('on', {
			action: 'bookingSuccessful',
			callback: (e) => {
				const sessionId = location.state.sessionId;
				const isInitialMessage = location.state.isInitialMessage;

				if (!isInitialMessage) {
					history.push({
						pathname: `/sessions/user/view`
					});
					return;
				}

				const { data } = e.detail;
				const date = data.date;
				const appointmentData = {
					userName: userData.userName,
					counselorEmail: data.organizer.email,
					date: date,
					duration: data.duration,
					title: `${data.eventType.title} ${translate(
						'message.appointmentSet.between'
					)} ${data.eventType.team.name} ${translate(
						'message.appointmentSet.and'
					)} ${userData.userName}`
				};

				apiAppointmentServiceSet(appointmentData, sessionId)
					.then(() => {
						history.push({
							pathname: `/sessions/user/view`
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
