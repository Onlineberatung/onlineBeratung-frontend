import { Consultant } from '../../api';
import { decodeUsername } from '../../utils/encryptionHelpers';
import { SelectDropdownItem } from '../select/SelectDropdown';

export const prepareSelectDropdown = ({
	consultantList,
	handleDatalistSelect,
	value
}) => {
	const selectDropdown: SelectDropdownItem = {
		id: 'assignSelect',
		selectedOptions: consultantList,
		handleDropdownSelect: handleDatalistSelect,
		selectInputLabel: 'session.u25.assignment.placeholder',
		useIconOption: true,
		isSearchable: true,
		menuPlacement: 'top'
	};
	if (value) {
		selectDropdown['defaultValue'] = consultantList.filter(
			(option) => option.value === value
		)[0];
	}
	return selectDropdown;
};

export const prepareConsultantDataForSelect = (consultants: Consultant[]) => {
	let availableConsultants = [];
	consultants.forEach((item) => {
		const label =
			item.firstName +
			` ` +
			item.lastName +
			' (' +
			decodeUsername(item.username) +
			')';

		const consultant = {
			value: item.consultantId,
			label,
			iconLabel: item.firstName.charAt(0) + item.lastName.charAt(0),
			consultantDisplayName: item.displayName
				? item.displayName
				: decodeUsername(item.username)
		};
		availableConsultants.push(consultant);
	});
	return availableConsultants;
};
