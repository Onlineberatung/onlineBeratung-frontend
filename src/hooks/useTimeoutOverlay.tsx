import { useEffect, useMemo, useRef, useState } from 'react';
import { OverlayItem } from '../components/overlay/Overlay';
import { ReactComponent as WaitingIcon } from '../resources/img/illustrations/waiting.svg';
import * as React from 'react';
import { LoadingIndicator } from '../components/loadingIndicator/LoadingIndicator';
import { useTranslation } from 'react-i18next';

export const useTimeoutOverlay = (
	triggered: boolean,
	headline?: string,
	text?: string,
	unloadMessage?: string,
	timeout: number = 2000
) => {
	const { t: translate } = useTranslation();
	const [visible, setVisible] = useState(false);

	const timeoutRef = useRef(null);
	useEffect(() => {
		if (triggered) {
			timeoutRef.current && clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => {
				setVisible(true);
			}, timeout);
		} else {
			timeoutRef.current && clearTimeout(timeoutRef.current);
			setVisible(false);
		}

		return () => {
			timeoutRef.current && clearTimeout(timeoutRef.current);
			setVisible(false);
		};
	}, [timeout, triggered]);

	const overlay: OverlayItem = useMemo(
		() => ({
			svg: WaitingIcon,
			headline: headline || translate('overlay.timeout.headline'),
			...(text ? { copy: text } : {}),
			nestedComponent: (
				<div style={{ display: 'inline-flex' }}>
					<LoadingIndicator />
				</div>
			)
		}),
		[headline, text, translate]
	);

	useEffect(() => {
		if (!triggered) {
			return () => {};
		}
		const unloadHandler = (e) => {
			e.returnValue = unloadMessage
				? unloadMessage
				: translate('overlay.timeout.confirm');
		};

		window.addEventListener('beforeunload', unloadHandler);
		return () => {
			window.removeEventListener('beforeunload', unloadHandler);
		};
	}, [translate, triggered, unloadMessage]);

	return {
		overlay,
		visible
	};
};
