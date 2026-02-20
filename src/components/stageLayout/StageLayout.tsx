import * as React from 'react';
import { Children, ReactElement, ReactNode, useContext } from 'react';
import { Button } from '../button/Button';
import { Text } from '../text/Text';
import './StageLayout.styles.scss';
import clsx from 'clsx';
import { LocaleContext } from '../../globalState';
import { useTranslation } from 'react-i18next';
import { LocaleSwitch } from '../localeSwitch/LocaleSwitch';
import { useAppConfig } from '../../hooks/useAppConfig';
import { useResponsive } from '../../hooks/useResponsive';
import { FooterLinks } from '../footer/FooterLinks';
import {
	MENUPLACEMENT_BOTTOM_LEFT,
	MENUPLACEMENT_BOTTOM_RIGHT
} from '../select/SelectDropdown';

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
	const { selectableLocales } = useContext(LocaleContext);
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
						<LocaleSwitch
							menuPlacement={
								!fromL
									? MENUPLACEMENT_BOTTOM_RIGHT
									: MENUPLACEMENT_BOTTOM_LEFT
							}
						/>
					</div>
				)}
				{showLoginLink && (
					<div className="stageLayout__toLogin">
						<div className="stageLayout__toLogin__button">
							<a
								href={`${settings.urls.toLogin}${
									loginParams ? `?${loginParams}` : ''
								}`}
								tabIndex={2}
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
								tabIndex={2}
								isLink
							/>
						</a>
					</div>
				)}
			</div>

			<div className="stageLayout__content">{children}</div>

			<div className="stageLayout__footer">
				{showLegalLinks && <FooterLinks sx={{ justifyContent: 'flex-end' }} />}
			</div>
		</div>
	);
};
