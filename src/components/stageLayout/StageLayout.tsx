import * as React from 'react';
import { Children, ReactNode, ReactElement, ComponentType } from 'react';
import { config } from '../../resources/scripts/config';
import { translate } from '../../utils/translate';
import { Button } from '../button/Button';
import { LegalInformationLinksProps } from '../login/LegalInformationLinks';
import { Text } from '../text/Text';
import './StageLayout.styles.scss';

interface StageLayoutProps {
	children: ReactNode;
	legalComponent: ComponentType<LegalInformationLinksProps>;
	stage: ReactNode;
	showLegalLinks?: boolean;
	showLoginLink?: boolean;
	loginParams?: string;
}

export const StageLayout = ({
	children,
	stage,
	showLegalLinks,
	showLoginLink,
	legalComponent: LegalComponent,
	loginParams
}: StageLayoutProps) => {
	return (
		<div className="stageLayout">
			{React.cloneElement(Children.only(stage as ReactElement), {
				className: 'stageLayout__stage'
			})}
			<div className="stageLayout__content">
				{children}
				{showLegalLinks && (
					<LegalComponent className="stageLayout__legalLinks" />
				)}
			</div>
			{showLoginLink && (
				<div className="stageLayout__toLogin">
					<Text
						type="infoSmall"
						text={translate('registration.login.helper')}
						className="stageLayout__toLogin__text"
					/>
					<div className="stageLayout__toLogin__button">
						<a
							href={`${config.urls.toLogin}${
								loginParams ? `?${loginParams}` : ''
							}`}
						>
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
