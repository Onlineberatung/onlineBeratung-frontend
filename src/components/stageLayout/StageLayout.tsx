import * as React from 'react';
import { Children, ReactNode, ReactElement, useContext } from 'react';
import { config } from '../../resources/scripts/config';
import { Button } from '../button/Button';
import { Text } from '../text/Text';
import './StageLayout.styles.scss';
import clsx from 'clsx';
import { AppLanguageContext, LegalLinkInterface } from '../../globalState';
import { useTranslation } from 'react-i18next';
import { LanguageSwitch } from '../languageSwitch/LanguageSwitch';
import { isMobile } from 'react-device-detect';

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
	const { t: translate } = useTranslation();
	const { appLanguage, setAppLanguage } = useContext(AppLanguageContext);

	return (
		<div className={clsx('stageLayout', className)}>
			{React.cloneElement(Children.only(stage as ReactElement), {
				className: 'stageLayout__stage'
			})}
			<div className={`stageLayout__header ${isMobile ? 'mobile' : ''}`}>
				<div>
					<LanguageSwitch
						appLanguage={appLanguage}
						setAppLanguage={setAppLanguage}
					/>
				</div>
				{showLoginLink && (
					<div className="stageLayout__toLogin">
						<div className="stageLayout__toLogin__button">
							<a
								href={`${config.urls.toLogin}${
									loginParams ? `?${loginParams}` : ''
								}`}
								tabIndex={-1}
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
								<button
									type="button"
									className="button-as-link"
									onClick={() =>
										window.open(legalLink.url, '_self')
									}
								>
									<Text
										className="stageLayout__legalLinksItem"
										type="infoSmall"
										text={legalLink.label}
									/>
								</button>
							</React.Fragment>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
