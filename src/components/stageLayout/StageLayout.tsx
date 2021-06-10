import * as React from 'react';
import { Children, ReactNode, ReactElement } from 'react';
import { config } from '../../resources/scripts/config';
import { translate } from '../../utils/translate';
import { Button } from '../button/Button';
import { LegalInformationLinks } from '../login/LegalInformationLinks';
import './StageLayout.styles.scss';

interface StageLayoutProps {
	children: ReactNode;
	stage: ReactNode;
	showLegalLinks?: boolean;
	showLoginLink?: boolean;
}

export const StageLayout = ({
	children,
	stage,
	showLegalLinks,
	showLoginLink
}: StageLayoutProps) => {
	return (
		<div className="stageLayout">
			{React.cloneElement(Children.only(stage as ReactElement), {
				className: 'stageLayout__stage'
			})}
			<div className="stageLayout__content">
				{children}
				{showLegalLinks && (
					<LegalInformationLinks className="stageLayout__legalLinks" />
				)}
			</div>
			{showLoginLink && (
				<div className="stageLayout__toLogin">
					<p className="stageLayout__toLogin__text">
						{translate('registration.login.helper')}
					</p>
					<div className="stageLayout__toLogin__button">
						<a href={config.urls.toLogin}>
							<Button
								item={{
									label: translate(
										'registration.login.label'
									),
									type: 'TERTIARY'
								}}
								isLink
							/>
						</a>
					</div>
				</div>
			)}
		</div>
	);
};
