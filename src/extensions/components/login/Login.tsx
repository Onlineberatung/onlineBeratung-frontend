import '../../../../src/polyfill';
import * as React from 'react';
import { ComponentType } from 'react';
import { StageProps } from '../../../../src/components/stage/stage';
import { StageLayout } from '../../../../src/components/stageLayout/StageLayout';
import '../../../../src/resources/styles/styles';
import '../../../../src/components/login/login.styles';
import useIsFirstVisit from '../../../../src/utils/useIsFirstVisit';
import useUrlParamsLoader from '../../../../src/utils/useUrlParamsLoader';

interface LoginProps {
	stageComponent: ComponentType<StageProps>;
}

export const Login = ({ stageComponent: Stage }: LoginProps) => {
	const { loaded: isReady } = useUrlParamsLoader();

	const isFirstVisit = useIsFirstVisit();

	return (
		<>
			<StageLayout
				stage={<Stage hasAnimation={isFirstVisit} isReady={isReady} />}
				showLegalLinks
			>
				<div className="loginForm">
					<div>My custom Login</div>
				</div>
			</StageLayout>
		</>
	);
};
