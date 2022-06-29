import * as React from 'react';
import { Children, ReactNode, ReactElement } from 'react';
import { config } from '../../resources/scripts/config';
import { translate } from '../../utils/translate';
import { Button } from '../button/Button';
import { Text } from '../text/Text';
import './StageLayout.styles.scss';
import clsx from 'clsx';
import { LegalLinkInterface } from '../../globalState';

interface StageLayoutProps {
	className?: string;
	children: ReactNode;
	legalLinks: Array<LegalLinkInterface>;
	stage: ReactNode;
	showLegalLinks?: boolean;
	showLoginLink?: boolean;
	loginParams?: string;
}

export const StageLayout = ({
	className,
	children,
	stage,
	showLegalLinks,
	showLoginLink,
	loginParams,
	legalLinks
}: StageLayoutProps) => {
	return (
		<div className={clsx('stageLayout', className)}>
			{React.cloneElement(Children.only(stage as ReactElement), {
				className: 'stageLayout__stage'
			})}
			<div className="stageLayout__content">
				{children}
				{showLegalLinks && (
					<div className="stageLayout__legalLinks">
						{legalLinks.map((legalLink, index) => (
							<React.Fragment key={legalLink.url}>
								{index > 0 && (
									<Text
										type="infoSmall"
										className="stageLayout__legalLinksSeparator"
										text=" | "
									/>
								)}
								<a
									key={legalLink.url}
									href={legalLink.url}
									target="_blank"
									rel="noreferrer"
								>
									<Text
										className="stageLayout__legalLinksItem"
										type="infoSmall"
										text={legalLink.label}
									/>
								</a>
							</React.Fragment>
						))}
					</div>
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
