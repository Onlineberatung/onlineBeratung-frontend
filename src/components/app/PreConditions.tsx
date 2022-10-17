/**
 * This component is rendered if some of the pre conditions are not met
 * In the future we could extend it to check for compatible browsers
 * and other stuff to prevent error logs which only happen because of missing
 * requirements
 */
import '../../polyfill';
import * as React from 'react';
import { ComponentType, useEffect, useState } from 'react';
import { StageProps } from '../stage/stage';
import { StageLayout } from '../stageLayout/StageLayout';
import { LegalLinkInterface } from '../../globalState';
import '../../resources/styles/styles';
import { Button, BUTTON_TYPES } from '../button/Button';
import { translate } from '../../utils/translate';

interface PreConditionsProps {
	legalLinks: Array<LegalLinkInterface>;
	stageComponent: ComponentType<StageProps>;
	onPreConditionsMet: Function;
}

const PRE_CONDITION_COOKIES = 'cookies';
type TPreConditionCookies = typeof PRE_CONDITION_COOKIES;

export const preConditionsMet = (): TPreConditionCookies => {
	/*
	 Check if sessionStorage is usable. If cookies blocked
	 the session storage is not available too
	 */
	try {
		sessionStorage.getItem('some_temporary_key');
	} catch {
		// App is not usable
		console.error('Cookies disabled for this page!');
		return PRE_CONDITION_COOKIES;
	}
	return null;
};

export const PreConditions = ({
	legalLinks,
	stageComponent: Stage,
	onPreConditionsMet
}: PreConditionsProps) => {
	const [failedPreCondition, setFailedPreCondition] =
		useState<TPreConditionCookies>(null);

	useEffect(() => {
		const interval = setInterval(() => {
			console.log('Checking pre conditions ...');
			const failedPreCondition = preConditionsMet();
			onPreConditionsMet(failedPreCondition);
			setFailedPreCondition(failedPreCondition);
		}, 2000);

		return () => {
			clearInterval(interval);
		};
	}, [onPreConditionsMet]);

	return (
		<>
			<StageLayout
				legalLinks={legalLinks}
				stage={<Stage hasAnimation={true} isReady={true} />}
				showLegalLinks
			>
				<FailedPreCondition failedPreCondition={failedPreCondition} />
			</StageLayout>
		</>
	);
};

const FailedPreCondition = ({
	failedPreCondition
}: {
	failedPreCondition: TPreConditionCookies;
}) => {
	switch (failedPreCondition) {
		case PRE_CONDITION_COOKIES:
			return (
				<>
					<h2>{translate('preconditions.cookie.headline')}</h2>
					<p>{translate('preconditions.cookie.paragraph.1')}</p>
					<p>{translate('preconditions.cookie.paragraph.2')}</p>
					<br />
					<Button
						buttonHandle={() => window.location.reload()}
						item={{
							label: translate('preconditions.cookie.button'),
							type: BUTTON_TYPES.PRIMARY
						}}
					/>
				</>
			);
		default:
			return null;
	}
};
