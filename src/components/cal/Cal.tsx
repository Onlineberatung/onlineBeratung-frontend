/* eslint-disable prefer-const */
import React, { useEffect, useRef } from 'react';
import useEmbed from './useEmbed';
import './cal.styles';
import { history } from '../app/app';
import { config as calComUrl } from '../../resources/scripts/config';

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
	if (!calLink) {
		throw new Error('calLink is required');
	}
	const initializedRef = useRef(false);
	const Cal = useEmbed(embedJsUrl);
	const ref = useRef<HTMLDivElement>(null);
	const messageID = history.location.state?.data;

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
		Cal('on', {
			action: 'bookingSuccessful',
			callback: (e, ...props) => {
				const { data, type, namespace } = e.detail;
				const fakeData = `https://calcom-develop.suchtberatung.digital/success?date=2022-06-24T09%3A30%3A00%2B01%3A00
				&type=11
				&name=example+name
				&bookingId=29`;
				history.push({
					pathname: `/sessions/user/view/${messageID}`,
					state: {
						data: fakeData
					}
				});

				// `data` is properties for the event.
				// `type` is the name of the action(You can also call it type of the action.) This would be same as "ANY_ACTION_NAME" except when ANY_ACTION_NAME="*" which listens to all the events.
				// `namespace` tells you the Cal namespace for which the event is fired/

				// const { data, type, namespace } = e.detail;
				console.log(e.detail);
			}
		});
		(window as any).Call = Cal;
	}, [Cal, calLink, config, calOrigin]);

	if (!Cal) {
		return <div>Loading {calLink}</div>;
	}

	return <div ref={ref}></div>;
}
