import * as React from 'react';
import { useState } from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { GeneratedInputs } from '../inputField/InputField';
import {
	OverlayWrapper,
	Overlay,
	OverlayItem,
	OVERLAY_FUNCTIONS
} from '../overlay/Overlay';
import { RadioButton } from '../radioButton/RadioButton';
import registrationResortsData from '../registration/registrationData';
import {
	getOptionOfSelectedValue,
	ResortData
} from '../registration/registrationHelpers';
import { SelectDropdown } from '../select/SelectDropdown';
import { TagSelect } from '../tagSelect/TagSelect';

interface VoluntaryInfoOverlayProps {
	consultingType: number;
}

export const VoluntaryInfoOverlay = (props: VoluntaryInfoOverlayProps) => {
	const [isOverlayActive, setIsOverlayActive] = useState<boolean>(false);
	const [
		valuesOfGeneratedInputs,
		setValuesOfGeneratedInputs
	] = useState<GeneratedInputs | null>(null);

	const resortDataArray = Object.entries(registrationResortsData).filter(
		(resort) =>
			resort[1].consultingType === props.consultingType?.toString()
	);

	const resortData: ResortData = resortDataArray[0][1];

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
		resortData.voluntaryComponents &&
		resortData.voluntaryComponents.map((component, index) => {
			return (
				<div key={index} className="registration__contentRow">
					<h3>{component.headline}</h3>
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
				type: BUTTON_TYPES.PRIMARY
			},
			{
				label: translate(
					'furtherSteps.voluntaryInfo.overlay.button2.label'
				),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.LINK
			}
		],
		headline: translate('furtherSteps.voluntaryInfo.overlay.headline'),
		headlineStyleLevel: '1',
		copy: translate('furtherSteps.voluntaryInfo.overlay.copy'),
		nestedComponent: voluntaryComponents
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setIsOverlayActive(false);
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
						item={VoluntaryInfoOverlayItem}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			)}
		</>
	);
};
