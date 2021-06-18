import * as React from 'react';
import { useEffect, useState } from 'react';
import { UserDataInterface } from '../../globalState/interfaces/UserDataInterface';
import { translate } from '../../utils/translate';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import Switch from 'react-switch';
import {
	Overlay,
	OverlayItem,
	OverlayWrapper,
	OVERLAY_FUNCTIONS
} from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import {
	InputField,
	InputFieldItem,
	InputFieldLabelState
} from '../inputField/InputField';
import { ReactComponent as DownloadIcon } from '../../resources/img/icons/download.svg';
import { ReactComponent as AddIcon } from '../../resources/img/icons/add.svg';
import { ReactComponent as UrlIcon } from '../../resources/img/icons/url.svg';
import { ReactComponent as CheckIcon } from '../../resources/img/icons/checkmark.svg';
import './twoFactorAuth.styles';

const TOTP_LENGTH = 6;

export const TwoFactorAuth = (props: UserDataInterface) => {
	const [isSwitchChecked, setIsSwitchChecked] = useState<boolean>(
		props.twoFactorAuth.isActive
	);
	const [overlayActive, setOverlayActive] = useState<boolean>(false);
	const [totp, setTotp] = useState<string>('');
	const [totpLabel, setTotpLabel] = useState<string>(
		translate('twoFactorAuth.activate.step3.input.label')
	);
	const [totpLabelState, setTotpLabelState] = useState<
		InputFieldLabelState
	>();

	useEffect(() => {
		setOverlayItems(twoFactorAuthStepsOverlay);
	}, [totp]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleSwitchChange = () => {
		setIsSwitchChecked(!isSwitchChecked);
		if (!isSwitchChecked) {
			setOverlayActive(true);
		} else {
			//TODO: deactivate 2fa
		}
	};

	const handleOverlayAction = (buttonFunction: string) => {
		console.log('handleOverlay');
		//TODO: activate 2fa
	};

	const getAuthenticatorTools = (): JSX.Element => {
		const tools = [
			{
				title: translate('twoFactorAuth.activate.step1.tool1'),
				urlGoogle: translate(
					'twoFactorAuth.activate.step1.tool1.url.google'
				),
				urlApple: translate(
					'twoFactorAuth.activate.step1.tool1.url.apple'
				)
			},
			{
				title: translate('twoFactorAuth.activate.step1.tool2'),
				urlGoogle: translate(
					'twoFactorAuth.activate.step1.tool2.url.google'
				),
				urlApple: translate(
					'twoFactorAuth.activate.step1.tool2.url.apple'
				)
			}
		];
		return (
			<div className="twoFactorAuth__tools">
				{tools.map((tool) => {
					return (
						<div className="twoFactorAuth__tool">
							<Text text={tool.title} type="standard" />
							<a
								target="_blank"
								rel="noreferrer"
								href={tool.urlGoogle}
							>
								<DownloadIcon />
								<Text
									text={translate(
										'twoFactorAuth.activate.step1.download.google'
									)}
									type="standard"
								/>
							</a>
							<a
								target="_blank"
								rel="noreferrer"
								href={tool.urlApple}
							>
								<DownloadIcon />
								<Text
									text={translate(
										'twoFactorAuth.activate.step1.download.apple'
									)}
									type="standard"
								/>
							</a>
						</div>
					);
				})}
			</div>
		);
	};

	const connectAuthAccount = (): JSX.Element => {
		return (
			<div className="twoFactorAuth__connect">
				<div className="twoFactorAuth__qrCode">
					<Text
						text={translate(
							'twoFactorAuth.activate.step2.connect.qrCode'
						)}
						type="standard"
					/>
					<img
						alt="qr code"
						src={`data:image/png;base64,${props.twoFactorAuth.qrCode}`}
					/>
				</div>
				<Text
					text={translate(
						'twoFactorAuth.activate.step2.connect.divider'
					)}
					type="divider"
				/>
				<div className="twoFactorAuth__key">
					<Text
						text={translate(
							'twoFactorAuth.activate.step2.connect.key'
						)}
						type="standard"
					/>
					<Text text={props.twoFactorAuth.secret} type="standard" />
				</div>
			</div>
		);
	};

	const totpInputItem: InputFieldItem = {
		content: totp,
		id: 'totp',
		label: totpLabel,
		name: 'totp',
		type: 'text',
		labelState: totpLabelState,
		maxLength: TOTP_LENGTH
	};

	const validateTotp = (
		totp
	): { validity: InputFieldLabelState; label: string } => {
		if (totp.length === TOTP_LENGTH) {
			return {
				validity: 'valid',
				label: translate('twoFactorAuth.activate.step3.input.label')
			};
		} else if (totp.lenght === 0) {
			return {
				validity: null,
				label: translate('twoFactorAuth.activate.step3.input.label')
			};
		} else if (totp.length < TOTP_LENGTH) {
			return {
				validity: 'invalid',
				label: translate(
					'twoFactorAuth.activate.step3.input.label.short'
				)
			};
		}
	};

	const handleTotpChange = (event) => {
		const validityData = validateTotp(event.target.value);
		setTotpLabelState(validityData.validity);
		setTotpLabel(validityData.label);
		setTotp(event.target.value);
	};

	const twoFactorAuthStepsOverlay: OverlayItem[] = [
		{
			headline: translate('twoFactorAuth.activate.step1.title'),
			copy: translate('twoFactorAuth.activate.step1.copy'),
			nestedComponent: getAuthenticatorTools(),
			buttonSet: [
				{
					label: translate('twoFactorAuth.overlayButton.next'),
					function: OVERLAY_FUNCTIONS.NEXT_STEP,
					type: BUTTON_TYPES.PRIMARY
				}
			],
			step: {
				icon: AddIcon,
				label: translate(
					'twoFactorAuth.activate.step1.visualisation.label'
				)
			}
		},
		{
			headline: translate('twoFactorAuth.activate.step2.title'),
			copy: translate('twoFactorAuth.activate.step2.copy'),
			nestedComponent: connectAuthAccount(),
			buttonSet: [
				{
					label: translate('twoFactorAuth.overlayButton.back'),
					function: OVERLAY_FUNCTIONS.PREV_STEP,
					type: BUTTON_TYPES.SECONDARY
				},
				{
					label: translate('twoFactorAuth.overlayButton.next'),
					function: OVERLAY_FUNCTIONS.NEXT_STEP,
					type: BUTTON_TYPES.PRIMARY
				}
			],
			step: {
				icon: UrlIcon,
				label: translate(
					'twoFactorAuth.activate.step2.visualisation.label'
				)
			}
		},
		{
			headline: translate('twoFactorAuth.activate.step3.title'),
			copy: translate('twoFactorAuth.activate.step3.copy'),
			nestedComponent: (
				<InputField
					item={totpInputItem}
					inputHandle={handleTotpChange}
				/>
			),
			buttonSet: [
				{
					label: translate('twoFactorAuth.overlayButton.back'),
					function: OVERLAY_FUNCTIONS.PREV_STEP,
					type: BUTTON_TYPES.SECONDARY
				},
				{
					disabled: totpLabelState !== 'valid',
					label: translate('twoFactorAuth.overlayButton.save'),
					type: BUTTON_TYPES.PRIMARY
				}
			],
			handleOverlay: handleOverlayAction,
			step: {
				icon: CheckIcon,
				label: translate(
					'twoFactorAuth.activate.step3.visualisation.label'
				)
			}
		}
	];

	const [overlayItems, setOverlayItems] = useState<OverlayItem[]>(
		twoFactorAuthStepsOverlay
	);
	return (
		<div className="twoFactorAuth">
			<div className="profile__content__title">
				<Headline
					text={translate('twoFactorAuth.title')}
					semanticLevel="5"
				/>
				<Text
					text={translate('twoFactorAuth.subtitle')}
					type="infoLargeAlternative"
				/>
			</div>
			<label className="twoFactorAuth__switch">
				<Switch
					onChange={handleSwitchChange}
					checked={isSwitchChecked}
					uncheckedIcon={false}
					checkedIcon={false}
					width={48}
					height={26}
					onColor="#0dcd21"
					offColor="#8C878C"
					boxShadow="0px 1px 4px rgba(0, 0, 0, 0.6)"
					handleDiameter={27}
					activeBoxShadow="none"
				/>
				<Text
					text={
						isSwitchChecked
							? translate('twoFactorAuth.switch.active.label')
							: translate('twoFactorAuth.switch.deactive.label')
					}
					type="standard"
				/>
			</label>
			{overlayActive ? (
				<OverlayWrapper>
					<Overlay
						className="twoFactorAuth__overlay"
						items={overlayItems}
						handleOverlayClose={() => setOverlayActive(false)}
					/>
				</OverlayWrapper>
			) : null}
		</div>
	);
};
