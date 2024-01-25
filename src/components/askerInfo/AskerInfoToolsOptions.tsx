import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import {
	SelectDropdown,
	SelectOption,
	SelectOptionsMulti
} from '../select/SelectDropdown';
import { ReactComponent as Info } from '../../resources/img/icons/i.svg';
import { Text } from '../text/Text';
import './askerInfoToolsOptions.styles';
import { apiGetTools } from '../../api/apiGetTools';
import { APIToolsInterface } from '../../globalState/interfaces/ToolsInterface';
import { Overlay, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import { BUTTON_TYPES } from '../button/Button';
import { Checkbox } from '../checkbox/Checkbox';
import { apiPutTools } from '../../api/apiPutTools';
import { useTranslation } from 'react-i18next';

interface AskerInfoToolsOptionsInterface {
	askerId: string;
}

export const AskerInfoToolsOptions = (
	props: AskerInfoToolsOptionsInterface
) => {
	const { t: translate } = useTranslation();
	const [selectedTools, setSelectedTools] = useState<SelectOption[]>([]);
	const [availableTools, setAvailableTools] = useState<SelectOption[]>([]);
	const [infoAboutToolsModal, setInfoAboutToolsModal] = useState<
		APIToolsInterface[]
	>([]);
	const [overlayContent, setOverlayContent] = useState(null);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [hasError, setHasError] = useState<boolean>(false);

	const updateSharedToolsModal = useCallback(
		(e, fromModal: boolean) => {
			let updatedToolsModal = [];
			if (fromModal) {
				updatedToolsModal = infoAboutToolsModal.map((tool) =>
					e.id === tool.toolId
						? {
								...tool,
								sharedWithAdviceSeeker:
									!tool.sharedWithAdviceSeeker
							}
						: tool
				);
			} else {
				updatedToolsModal = infoAboutToolsModal.map((tool) =>
					e.includes(tool.toolId)
						? {
								...tool,
								sharedWithAdviceSeeker: true
							}
						: {
								...tool,
								sharedWithAdviceSeeker: false
							}
				);
			}
			setInfoAboutToolsModal(updatedToolsModal);
		},
		[infoAboutToolsModal]
	);

	const setSelectedToolsOptions = useCallback(
		(toolsData: APIToolsInterface[]) => {
			let toolsSelected = [];
			toolsData.forEach((tool) => {
				if (tool.sharedWithAdviceSeeker) {
					toolsSelected.push({
						value: tool.toolId,
						label: tool.title
					});
				}
			});
			setSelectedTools(toolsSelected);
		},
		[]
	);

	const updateTools = useCallback(
		(fromModal: boolean, selectedOption?: SelectOptionsMulti) => {
			let activeTools: string[];
			if (fromModal) {
				activeTools = infoAboutToolsModal
					.filter(
						(tool: APIToolsInterface) => tool.sharedWithAdviceSeeker
					)
					.map((toolActive) => toolActive.toolId);
				setSelectedToolsOptions(infoAboutToolsModal);
			} else {
				let selected = [];
				if (selectedOption.removedValue) {
					selected = selectedTools.filter(
						(tool) =>
							tool.value !== selectedOption.removedValue.value
					);
				} else if (selectedOption.option) {
					selected = [...selectedTools, selectedOption.option];
				}
				setSelectedTools(selected);
				activeTools = selected.map((tool) => tool.value);
				updateSharedToolsModal(activeTools, false);
			}
			apiPutTools(props.askerId, activeTools).catch(() => {
				setHasError(true);
				setSelectedTools([]);
				const resetTools = infoAboutToolsModal.map((tool) => {
					return {
						...tool,
						sharedWithAdviceSeeker: false
					};
				});
				setInfoAboutToolsModal(resetTools);
			});
		},
		[
			infoAboutToolsModal,
			props.askerId,
			selectedTools,
			setSelectedToolsOptions,
			updateSharedToolsModal
		]
	);

	const selectHandler = useCallback(
		(selectedOption: SelectOptionsMulti) => {
			updateTools(false, selectedOption);
		},
		[updateTools]
	);

	const setAvailableToolsOptions = useCallback(
		(toolsData: APIToolsInterface[]) => {
			setAvailableTools(
				toolsData.map((tool) => {
					return {
						value: tool.toolId,
						label: tool.title
					};
				})
			);
			let toolsSelected = [];
			toolsData.forEach((tool) => {
				if (tool.sharedWithAdviceSeeker) {
					toolsSelected.push({
						value: tool.toolId,
						label: tool.title
					});
				}
			});
			setSelectedTools(toolsSelected);
			setInfoAboutToolsModal(toolsData);
		},
		[]
	);

	const resetToolsAfterCloseModal = useCallback(() => {
		const activeTools = selectedTools.map((tool) => tool.value);
		const resetTools = infoAboutToolsModal.map((tool) => {
			return activeTools.includes(tool.toolId)
				? {
						...tool,
						sharedWithAdviceSeeker: true
					}
				: {
						...tool,
						sharedWithAdviceSeeker: false
					};
		});
		setInfoAboutToolsModal(resetTools);
		setShowModal(false);
	}, [infoAboutToolsModal, selectedTools]);

	const handleOverlayAction = useCallback(
		(buttonFunction: string) => {
			switch (buttonFunction) {
				case OVERLAY_FUNCTIONS.CONFIRM_EDIT:
					updateTools(true);
					setShowModal(false);
					break;
				case OVERLAY_FUNCTIONS.CLOSE:
					resetToolsAfterCloseModal();
					break;
			}
		},
		[resetToolsAfterCloseModal, updateTools]
	);

	useEffect(() => {
		const overlayContent = (
			<>
				{infoAboutToolsModal.map((tool: APIToolsInterface) => (
					<Checkbox
						key={tool.title}
						className="textarea__checkbox"
						item={{
							inputId: tool.toolId,
							name: tool.title,
							labelId: tool.title,
							label: tool.title,
							description: tool.description,
							checked: !!tool.sharedWithAdviceSeeker
						}}
						checkboxHandle={(e) =>
							updateSharedToolsModal(e.target, true)
						}
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
	}, [infoAboutToolsModal]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (props.askerId) {
			apiGetTools(props.askerId).then((resp: APIToolsInterface[]) => {
				setAvailableToolsOptions(resp);
			});
		}
	}, [props.askerId]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="askerInfoToolsOptions">
			<Text text={translate('userProfile.tools.title')} type="divider" />
			<Text
				text={translate('userProfile.tools.description')}
				type="infoSmall"
			/>
			<button
				type="button"
				className="askerInfoToolsOptions__button text--tertiary primary button-as-link"
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
				menuPosition="fixed"
				menuShouldBlockScroll
				selectedOptions={availableTools}
				isSearchable={false}
				isMulti
				isClearable={false}
				defaultValue={selectedTools}
				placeholder={translate('userProfile.tools.optionsPlaceholder')}
				hasError={hasError}
				errorMessage={translate('userProfile.tools.options.saveError')}
			/>
			{showModal && overlayContent && (
				<Overlay
					className="askerInfoToolsOptions__overlay"
					item={overlayContent}
					handleOverlayClose={() => resetToolsAfterCloseModal()}
					handleOverlay={handleOverlayAction}
				/>
			)}
		</div>
	);
};
