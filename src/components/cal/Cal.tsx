/* eslint-disable prefer-const */
import React, { useEffect, useRef } from 'react';
import useEmbed from './useEmbed';

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
	useEffect(() => {
		if (!Cal || initializedRef.current) {
			return;
		}
		initializedRef.current = true;
		const element = ref.current;
		let initConfig = {
			debug: true,
			styles: {
				body: {
					'backgroundColor': 'red',
					'background-color': 'red'
				}
			}
		};
		if (calOrigin) {
			(initConfig as any).origin = calOrigin;
		}
		Cal('init', initConfig);
		Cal('ui', {
			styles: {
				body: {
					'background': 'red',
					'background-color': 'red'
				},
				eventTypeListItem: {
					background: 'red',
					color: 'white',
					backgroundColor: 'red'
				},
				enabledDateButton: {
					background: 'red',
					color: 'white',
					backgroundColor: 'red'
				},
				disabledDateButton: {
					background: 'red',
					color: 'white',
					backgroundColor: 'red'
				},
				availabilityDatePicker: {
					background: 'red',
					color: 'white',
					backgroundColor: 'red'
				},
				branding: {
					brandColor: 'purple',
					lightColor: 'blue',
					lighterColor: 'grey',
					lightestColor: 'green',
					highlightColor: 'yellow',
					darkColor: 'blue',
					darkerColor: 'blue',
					medianColor: 'blue'
				}
			}
		});
		Cal('inline', {
			elementOrSelector: element,
			calLink,
			config
		});
		Cal('on', {
			action: 'bookingSuccessful',
			callback: (e) => {
				// `data` is properties for the event.
				// `type` is the name of the action(You can also call it type of the action.) This would be same as "ANY_ACTION_NAME" except when ANY_ACTION_NAME="*" which listens to all the events.
				// `namespace` tells you the Cal namespace for which the event is fired/
				const { data, type, namespace } = e.detail;
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
