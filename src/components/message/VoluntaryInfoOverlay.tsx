import * as React from 'react';
import { useContext, useState } from 'react';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { Headline } from '../headline/Headline';
import { GeneratedInputs } from '../inputField/InputField';
import { Overlay, OverlayItem, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { RadioButton } from '../radioButton/RadioButton';
import { getOptionOfSelectedValue } from '../registration/registrationHelpers';
import { SelectDropdown } from '../select/SelectDropdown';
import { TagSelect } from '../tagSelect/TagSelect';
import { ReactComponent as SuccessIllustration } from '../../resources/img/illustrations/check.svg';
import { apiPutSessionData } from '../../api';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { useTranslation } from 'react-i18next';

interface VoluntaryInfoOverlayProps {
	voluntaryComponents: any[];
	handleSuccess: Function;
	consultingTypeId: number;
}

export const VoluntaryInfoOverlay = (props: VoluntaryInfoOverlayProps) => {
	const { t: translate } = useTranslation(['common', 'consultingTypes']);
	const { activeSession } = useContext(ActiveSessionContext);
	const [isOverlayActive, setIsOverlayActive] = useState<boolean>(false);
	const [valuesOfGeneratedInputs, setValuesOfGeneratedInputs] =
		useState<GeneratedInputs | null>(null);
	const [isSuccessOverlay, setIsSuccessOverlay] = useState<boolean>(false);
	const [generatedRegistrationData, setGeneratedRegistrationData] =
		useState<any>();

	const renderInputComponent = (component, index) => {
		if (component.componentType === 'SelectDropdown') {
			const translatedItem = {
				...component.item,
				selectInputLabel: translate(
					[
						`consultingType.${props.consultingTypeId}.voluntaryComponents.${component.name}.selectInputLabel`,
						component.item.selectInputLabel
					],
					{ ns: 'consultingTypes' }
				),
				selectedOptions: [
					...component.item.selectedOptions.map((option) => ({
						value: option.value,
						label: translate(
							[
								`consultingType.${props.consultingTypeId}.voluntaryComponents.${component.name}.${option.value}`,
								option.label
							],
							{ ns: 'consultingTypes' }
						)
					}))
				]
			};
			return (
				<SelectDropdown
					key={index}
					handleDropdownSelect={(e) =>
						handleGeneratedInputfieldValueChange(
							e.value,
							component.name
						)
					}
					defaultValue={
						valuesOfGeneratedInputs
							? getOptionOfSelectedValue(
									translatedItem.selectedOptions,
									valuesOfGeneratedInputs[component.name]
							  )
							: null
					}
					{...translatedItem}
				/>
			);
		} else if (component.componentType === 'RadioButton') {
			return component.radioButtons.map((radio, index) => {
				const translatedItem = {
					...radio,
					label: translate(
						[
							`consultingType.${props.consultingTypeId}.voluntaryComponents.${component.name}.${radio.inputId}`,
							radio.label
						],
						{ ns: 'consultingTypes' }
					)
				};
				return (
					<RadioButton
						key={index}
						name={component.name}
						handleRadioButton={(e) =>
							handleGeneratedInputfieldValueChange(
								e.target.value,
								component.name
							)
						}
						type="box"
						value={index}
						{...translatedItem}
					/>
				);
			});
		} else if (component.componentType === 'TagSelect') {
			return component.tagSelects.map((tag, index) => {
				const translatedItem = {
					...tag,
					label: translate(
						[
							`consultingType.${props.consultingTypeId}.voluntaryComponents.${component.name}.${tag.id}`,
							tag.label
						],
						{ ns: 'consultingTypes' }
					)
				};
				return (
					<TagSelect
						key={index}
						name={component.name}
						value={index}
						handleTagSelectClick={(e) =>
							handleGeneratedInputfieldValueChange(
								e.target.value,
								component.name,
								true
							)
						}
						{...translatedItem}
					/>
				);
			});
		}
	};

	const voluntaryComponents =
		props.voluntaryComponents &&
		props.voluntaryComponents.map((component, index) => {
			return (
				<div key={index} className="voluntaryInfo__row">
					<Headline
						semanticLevel="2"
						styleLevel="5"
						text={translate(
							[
								`consultingType.${props.consultingTypeId}.voluntaryComponents.${component.name}.headline`,
								component.headline
							],
							{ ns: 'consultingTypes' }
						)}
					/>
					{renderInputComponent(component, index)}
				</div>
			);
		});

	const handleGeneratedInputfieldValueChange = (
		inputValue,
		inputName,
		areMultipleValuesAllowed?
	) => {
		if (areMultipleValuesAllowed) {
			const values =
				valuesOfGeneratedInputs && valuesOfGeneratedInputs[inputName]
					? valuesOfGeneratedInputs[inputName]
					: [];
			const index = values.indexOf(inputValue);
			if (index > -1) {
				values.splice(index, 1);
			} else {
				values.push(inputValue);
			}
			setValuesOfGeneratedInputs({
				...valuesOfGeneratedInputs,
				[inputName]: values
			});
		} else {
			setValuesOfGeneratedInputs({
				...valuesOfGeneratedInputs,
				[inputName]: inputValue
			});
		}
	};

	const addVoluntaryInfoButton: ButtonItem = {
		label: translate('furtherSteps.voluntaryInfo.button'),
		type: BUTTON_TYPES.LINK
	};

	const VoluntaryInfoOverlayItem: OverlayItem = {
		buttonSet: [
			{
				label: translate(
					'furtherSteps.voluntaryInfo.overlay.button1.label'
				),
				type: BUTTON_TYPES.PRIMARY,
				disabled: !valuesOfGeneratedInputs
			},
			{
				label: translate(
					'furtherSteps.voluntaryInfo.overlay.button2.label'
				),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.SECONDARY
			}
		],
		headline: translate('furtherSteps.voluntaryInfo.overlay.headline'),
		headlineStyleLevel: '1',
		copy: translate('furtherSteps.voluntaryInfo.overlay.copy'),
		nestedComponent: voluntaryComponents
	};

	const successOverlayItem: OverlayItem = {
		buttonSet: [
			{
				label: translate(
					'furtherSteps.voluntaryInfo.overlay.button2.label'
				),
				function: OVERLAY_FUNCTIONS.CLOSE_SUCCESS,
				type: BUTTON_TYPES.PRIMARY
			}
		],
		headline: translate(
			'furtherSteps.voluntaryInfo.overlay.success.headline'
		),
		svg: SuccessIllustration
	};

	const handleVoluntaryInfoSubmit = () => {
		if (valuesOfGeneratedInputs) {
			const { addictiveDrugs, ...voluntaryFieldsWithOneValue } =
				valuesOfGeneratedInputs;

			const generatedRegistrationDataSet = {
				...(valuesOfGeneratedInputs['addictiveDrugs'] && {
					addictiveDrugs:
						valuesOfGeneratedInputs['addictiveDrugs'].join(',')
				}),
				...voluntaryFieldsWithOneValue
			};

			apiPutSessionData(
				activeSession.item.id,
				generatedRegistrationDataSet
			)
				.then(() => {
					setIsSuccessOverlay(true);
					setGeneratedRegistrationData(generatedRegistrationDataSet);
				})
				.catch((error) => {
					console.error(
						'Could not submit voluntary information ',
						error
					);
				});
		}
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setIsOverlayActive(false);
			setIsSuccessOverlay(false);
			setValuesOfGeneratedInputs(null);
		} else if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE_SUCCESS) {
			setIsOverlayActive(false);
			setIsSuccessOverlay(false);
			setValuesOfGeneratedInputs(null);
			props.handleSuccess(generatedRegistrationData);
		} else {
			handleVoluntaryInfoSubmit();
		}
	};

	return (
		<>
			<Button
				item={addVoluntaryInfoButton}
				buttonHandle={() => setIsOverlayActive(true)}
			/>
			{isOverlayActive && (
				<Overlay
					item={
						isSuccessOverlay
							? successOverlayItem
							: VoluntaryInfoOverlayItem
					}
					handleOverlay={handleOverlayAction}
				/>
			)}
		</>
	);
};
