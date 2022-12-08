import React, { useContext, useEffect, useState } from 'react';

import { Overlay, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import { Headline } from '../headline/Headline';
import './termsandconfitions.styles.scss';
import { useTranslation } from 'react-i18next';
import { OVERLAY_TERMS_AND_CONDITION } from '../../globalState/interfaces/AppConfig/OverlaysConfigInterface';
import {
	UserDataContext,
	UserDataInterface,
	useTenant
} from '../../globalState';
import { TenantDataInterface } from '../../globalState/interfaces/TenantDataInterface';
import { Checkbox, CheckboxItem } from '../checkbox/Checkbox';
import { apiPatchUserData } from '../../api/apiPatchUserData';
import { logout } from '../logout/logout';

const termsChanged = (
	tenantData: TenantDataInterface,
	userData: UserDataInterface
) => {
	if (tenantData) {
		return (
			userData.termsAndConditionsConfirmation === null ||
			new Date(userData.termsAndConditionsConfirmation) <
				new Date(tenantData.content.termsAndConditionsConfirmation)
		);
	}
	return false;
};

const privacyChanged = (
	tenantData: TenantDataInterface,
	userData: UserDataInterface
) => {
	if (tenantData) {
		return (
			userData.dataPrivacyConfirmation === null ||
			new Date(userData.dataPrivacyConfirmation) <
				new Date(tenantData.content.dataPrivacyConfirmation)
		);
	}
	return false;
};

export const TermsAndConditions = () => {
	const { t: translate } = useTranslation();
	const tenantData = useTenant();
	const { userData } = useContext(UserDataContext);
	let [viewState, setViewState] = useState({
		headlineText: '',
		mainText: '',
		checkboxText: '',
		showOverlay: false,
		userConfirmed: false,
		buttons: []
	});

	const transformText2Link = (text: string) => {
		let termsLabel = translate(
			'termsAndConditionOverlay.labels.termsAndCondition'
		);
		let privacyLabel = translate('termsAndConditionOverlay.labels.privacy');
		text = text.replace(
			termsLabel,
			`<a class='link' href='/nutzungsbedingungen'>${termsLabel}</a>`
		);
		return text.replace(
			privacyLabel,
			`<a class='link' href='/datenschutz'>${privacyLabel}</a>`
		);
	};

	const transformText2DataPrivacyLink = (text: string) => {
		let hereLabel = translate('termsAndConditionOverlay.labels.here');
		return text.replace(
			hereLabel,
			`<a class='link' href='/datenschutz'>${hereLabel}</a>`
		);
	};

	useEffect(() => {
		const standardButtons = (userConfirmed: boolean) => {
			return [
				{
					label: translate(
						'termsAndConditionOverlay.buttons.decline'
					),
					function: OVERLAY_FUNCTIONS.CLOSE,
					type: BUTTON_TYPES.SECONDARY
				},
				{
					label: translate('termsAndConditionOverlay.buttons.accept'),
					disabled: !userConfirmed,
					type: BUTTON_TYPES.PRIMARY
				}
			];
		};

		const dataPrivacyButtons = [
			{
				label: translate('termsAndConditionOverlay.buttons.continue'),
				type: BUTTON_TYPES.PRIMARY
			}
		];

		if (
			termsChanged(tenantData, userData) &&
			privacyChanged(tenantData, userData)
		) {
			setViewState({
				headlineText: translate(
					'termsAndConditionOverlay.title.termsAndConditionAndPrivacy'
				),
				mainText: translate(
					'termsAndConditionOverlay.contentLine1.termsAndConditionAndPrivacy'
				),
				checkboxText: transformText2Link(
					translate(
						'termsAndConditionOverlay.contentLine2.termsAndConditionAndPrivacy'
					)
				),
				showOverlay: true,
				userConfirmed: viewState.userConfirmed,
				buttons: standardButtons(viewState.userConfirmed)
			});
		} else if (termsChanged(tenantData, userData)) {
			setViewState({
				headlineText: translate(
					'termsAndConditionOverlay.title.termsAndCondition'
				),
				mainText: translate(
					'termsAndConditionOverlay.contentLine1.termsAndCondition'
				),
				checkboxText: transformText2Link(
					translate(
						'termsAndConditionOverlay.contentLine2.termsAndCondition'
					)
				),
				showOverlay: true,
				userConfirmed: viewState.userConfirmed,
				buttons: standardButtons(viewState.userConfirmed)
			});
		} else if (privacyChanged(tenantData, userData)) {
			setViewState({
				headlineText: translate(
					'termsAndConditionOverlay.title.privacy'
				),
				mainText: transformText2DataPrivacyLink(
					translate('termsAndConditionOverlay.contentLine1.privacy')
				),
				checkboxText: null,
				showOverlay: true,
				userConfirmed: viewState.userConfirmed,
				buttons: dataPrivacyButtons
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [viewState.userConfirmed]);

	if (!viewState.showOverlay) {
		return <></>;
	}

	const checkboxItemDataProtection: CheckboxItem = {
		inputId: 'dataProtectionCheckbox',
		name: 'dataProtectionCheckbox',
		labelId: 'dataProtectionLabel',
		checked: viewState.userConfirmed,
		label: viewState.checkboxText
	};

	const handleOverlay = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			logout();
			return;
		}
		apiPatchUserData({
			termsAndConditionsConfirmation: termsChanged(tenantData, userData),
			dataPrivacyConfirmation: privacyChanged(tenantData, userData)
		}).then(() => {
			setViewState({ ...viewState, showOverlay: false });
		});
	};

	return (
		<Overlay
			className="termsAndConditions"
			name={OVERLAY_TERMS_AND_CONDITION}
			handleOverlay={handleOverlay}
			item={{
				illustrationBackground: 'neutral',
				nestedComponent: (
					<>
						<Headline
							text={viewState.headlineText}
							semanticLevel="2"
						/>
						<div>
							<label
								dangerouslySetInnerHTML={{
									__html: viewState.mainText
								}}
							/>

							<div
								style={{
									marginTop: '20px',
									marginBottom: '10px'
								}}
							>
								{viewState.checkboxText && (
									<Checkbox
										item={checkboxItemDataProtection}
										checkboxHandle={() =>
											setViewState({
												...viewState,
												userConfirmed:
													!viewState.userConfirmed
											})
										}
										onKeyPress={(event) => {
											if (event.key === 'Enter') {
												setViewState({
													...viewState,
													userConfirmed:
														!viewState.userConfirmed
												});
											}
										}}
									/>
								)}
							</div>
						</div>
					</>
				),
				buttonSet: viewState.buttons
			}}
		/>
	);
};
