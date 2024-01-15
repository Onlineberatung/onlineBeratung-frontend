import * as React from 'react';
import { Children, ReactNode, ReactElement, useContext } from 'react';
import { Button } from '../button/Button';
import { Text } from '../text/Text';
import './StageLayout.styles.scss';
import clsx from 'clsx';
import { AgencySpecificContext, LocaleContext } from '../../globalState';
import { useTranslation } from 'react-i18next';
import { LocaleSwitch } from '../localeSwitch/LocaleSwitch';
import { LegalLinksContext } from '../../globalState/provider/LegalLinksProvider';
import { useAppConfig } from '../../hooks/useAppConfig';
import { useResponsive } from '../../hooks/useResponsive';

interface StageLayoutProps {
	className?: string;
	children: ReactNode;
	stage: ReactNode;
	showLegalLinks?: boolean;
	showLoginLink?: boolean;
	showRegistrationLink?: boolean;
	loginParams?: string;
}

export const StageLayout = ({
	className,
	children,
	stage,
	showLegalLinks,
	showLoginLink,
	showRegistrationLink,
	loginParams
}: StageLayoutProps) => {
	const { t: translate } = useTranslation();
	const legalLinks = useContext(LegalLinksContext);
	const { selectableLocales } = useContext(LocaleContext);
	const { specificAgency } = useContext(AgencySpecificContext);
	const settings = useAppConfig();
	const { fromL } = useResponsive();

	return (
		<div className={clsx('stageLayout', className)}>
			{React.cloneElement(Children.only(stage as ReactElement), {
				className: 'stageLayout__stage'
			})}
			<div className={`stageLayout__header ${!fromL ? 'mobile' : ''}`}>
				{selectableLocales.length > 1 && (
					<div>
						<LocaleSwitch />
					</div>
				)}
				{showLoginLink && (
					<div className="stageLayout__toLogin">
						<div className="stageLayout__toLogin__button">
							<a
								href={`${settings.urls.toLogin}${
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

				{showRegistrationLink && (
					<div className="login__tenantRegistration">
						<Text
							text={translate('login.register.infoText.title')}
							type={'infoSmall'}
						/>
						<a
							className="login__tenantRegistrationLink"
							href={settings.urls.toRegistration}
							target="_self"
							tabIndex={-1}
						>
							<Button
								item={{
									label: translate(
										'login.register.linkLabel'
									),
									type: 'TERTIARY'
								}}
								isLink
							/>
						</a>
					</div>
				)}
			</div>

			<div className="stageLayout__content">{children}</div>

			<div className="stageLayout__footer">
				{showLegalLinks && (
					<div className={`stageLayout__legalLinks`}>
						{legalLinks.map((legalLink, index) => (
							<React.Fragment
								key={legalLink.getUrl({
									aid: specificAgency?.id
								})}
							>
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
									data-cy-link={legalLink.getUrl({
										aid: specificAgency?.id
									})}
									onClick={() =>
										window.open(
											legalLink.getUrl({
												aid: specificAgency?.id
											}),
											'_blank'
										)
									}
								>
									<Text
										className="stageLayout__legalLinksItem"
										type="infoSmall"
										text={translate(legalLink.label)}
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
