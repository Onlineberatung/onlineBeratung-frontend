import * as React from 'react';
import { useEffect, useState } from 'react';
import { translate } from '../../utils/translate';
import {
	SelectDropdown,
	SelectOption,
	SelectOptionsMulti
} from '../select/SelectDropdown';
import { ReactComponent as Info } from '../../resources/img/icons/i.svg';
import { Text } from '../text/Text';
import './askerInfoToolsOptions.styles';
import { apiGetBudibaseTools } from '../../api/apiGetBudibaseTools';
import { APIToolsInterface } from '../../globalState/interfaces/ToolsInterface';
import { OverlayWrapper, Overlay, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import { Checkbox } from '../checkbox/Checkbox';

export const AskerInfoToolsOptions = () => {
	const [selectedTools, setSelectedTools] = useState<SelectOption[]>([]);
	const [availableTools, setAvailableTools] = useState<SelectOption[]>([]);
	const [infoAboutTools, setInfoAboutTools] = useState<APIToolsInterface[]>(
		[]
	);
	const [overlayContent, setOverlayContent] = useState(null);
	const [showModal, setShowModal] = useState<Boolean>(false);

	const selectHandler = (selectedOption: SelectOptionsMulti) => {
		let newSelectedTools = selectedTools;
		if (selectedOption.removedValue) {
			setSelectedTools(
				newSelectedTools.filter(
					(tool) => tool.value !== selectedOption.removedValue.value
				)
			);
		} else if (selectedOption.option) {
			newSelectedTools.push(selectedOption.option);
			setSelectedTools(newSelectedTools);
		}
	};

	const setAvailableToolsOptions = (toolsData: APIToolsInterface[]) => {
		setAvailableTools(
			toolsData.map((tool) => {
				return {
					value: tool.title,
					label: tool.title
				};
			})
		);
	};

	const setSelectedToolsOptions = (toolsData: APIToolsInterface[]) => {
		let toolsSelected = [];
		toolsData.forEach((tool) => {
			if (tool.sharedWithAdviceSeeker) {
				toolsSelected.push({
					value: tool.title,
					label: tool.title
				});
			}
		});
		setSelectedTools(toolsSelected);
	};

	const updateSharedTools = (e) => {
		const updatedTools = infoAboutTools.map((tool) =>
			e.id === tool.title
				? {
						...tool,
						sharedWithAdviceSeeker: !tool.sharedWithAdviceSeeker
				  }
				: tool
		);
		setInfoAboutTools(updatedTools);
	};

	const handleOverlayAction = (buttonFunction: string) => {
		switch (buttonFunction) {
			case OVERLAY_FUNCTIONS.CONFIRM_EDIT:
				setShowModal(false);
				break;
			case OVERLAY_FUNCTIONS.CLOSE:
				setShowModal(false);
				break;
		}
	};

	useEffect(() => {
		const overlayContent = (
			<>
				{infoAboutTools.map((tool: APIToolsInterface) => (
					<Checkbox
						key={tool.title}
						className="textarea__checkbox"
						item={{
							inputId: tool.title,
							name: tool.title,
							labelId: tool.title,
							label: tool.title,
							description: tool.description,
							checked: !!tool.sharedWithAdviceSeeker
						}}
						checkboxHandle={(e) => updateSharedTools(e.target)}
					/>
				))}
			</>
		);

		const overlayItem = {
			headline: translate('userProfile.tools.modal.title'),
			copy: translate('userProfile.tools.modal.description'),
			buttonSet: [
				{
					label: translate('userProfile.tools.modal.deny'),
					function: OVERLAY_FUNCTIONS.CLOSE,
					type: BUTTON_TYPES.SECONDARY
				},
				{
					label: translate('userProfile.tools.modal.confirm'),
					function: OVERLAY_FUNCTIONS.CONFIRM_EDIT,
					type: BUTTON_TYPES.PRIMARY
				}
			],
			nestedComponent: overlayContent,
			handleOverlay: () => {
				setShowModal(false);
			}
		};

		setOverlayContent(overlayItem);
	}, [infoAboutTools]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		apiGetBudibaseTools('f5a30db9-e9d4-4076-b9d0-a460f3e68911').then(
			(resp: APIToolsInterface[]) => {
				setAvailableToolsOptions(resp);
				setSelectedToolsOptions(resp);
				setInfoAboutTools(resp);
			}
		);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="asker-info-tools-options">
			<Text text={translate('userProfile.tools.title')} type="divider" />
			<Text
				text={translate('userProfile.tools.description')}
				type="infoSmall"
			/>
			<button
				type="button"
				className="asker-info-tools-options__button text--tertiary primary button-as-link"
				onClick={() => setShowModal(true)}
			>
				<Info />
				{translate('userProfile.tools.openModal')}
			</button>
			<SelectDropdown
				handleDropdownSelect={(_, selectedOption: SelectOptionsMulti) =>
					selectHandler(selectedOption)
				}
				id="tools-select"
				menuPlacement="bottom"
				selectedOptions={availableTools}
				isSearchable={false}
				isMulti
				isClearable={false}
				defaultValue={selectedTools}
				placeholder={translate('userProfile.tools.optionsPlaceholder')}
			/>
			{showModal && overlayContent && (
				<OverlayWrapper>
					<Overlay
						className="asker-info-tools-options__overlay"
						item={overlayContent}
						handleOverlayClose={() => {
							setShowModal(false);
						}}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			)}
		</div>
	);
};
