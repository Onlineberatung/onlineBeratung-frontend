import * as React from 'react';
import { useContext, useState } from 'react';
import { translate } from '../../utils/translate';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { Headline } from '../headline/Headline';
import { GeneratedInputs } from '../inputField/InputField';
import {
	OverlayWrapper,
	Overlay,
	OverlayItem,
	OVERLAY_FUNCTIONS
} from '../overlay/Overlay';
import { RadioButton } from '../radioButton/RadioButton';
import { getOptionOfSelectedValue } from '../registration/registrationHelpers';
import { SelectDropdown } from '../select/SelectDropdown';
import { TagSelect } from '../tagSelect/TagSelect';
import { ReactComponent as SuccessIllustration } from '../../resources/img/illustrations/check.svg';
import { apiPutSessionData } from '../../api';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';

interface VoluntaryInfoOverlayProps {
	voluntaryComponents: any[];
	handleSuccess: Function;
}

export const VoluntaryInfoOverlay = (props: VoluntaryInfoOverlayProps) => {
	const activeSession = useContext(ActiveSessionContext);
	const [isOverlayActive, setIsOverlayActive] = useState<boolean>(false);
	const [valuesOfGeneratedInputs, setValuesOfGeneratedInputs] =
		useState<GeneratedInputs | null>(null);
	const [isSuccessOverlay, setIsSuccessOverlay] = useState<boolean>(false);
	const [generatedRegistrationData, setGeneratedRegistrationData] =
		useState<any>();

	const renderInputComponent = (component, index) => {
		if (component.componentType === 'SelectDropdown') {
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
									component.item.selectedOptions,
									valuesOfGeneratedInputs[component.name]
							  )
							: null
					}
					{...component.item}
				/>
			);
		} else if (component.componentType === 'RadioButton') {
			return component.radioButtons.map((radio, index) => {
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
						{...radio}
					/>
				);
			});
		} else if (component.componentType === 'TagSelect') {
			return component.tagSelects.map((tag, index) => {
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
						{...tag}
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
						text={component.headline}
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
				activeSession.session.id,
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
				<OverlayWrapper>
					<Overlay
						item={
							isSuccessOverlay
								? successOverlayItem
								: VoluntaryInfoOverlayItem
						}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			)}
		</>
	);
};
