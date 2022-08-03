import { Consultant } from '../../api';
import { decodeUsername } from '../../utils/encryptionHelpers';
import { translate } from '../../utils/translate';
import { SelectDropdownItem, SelectOption } from '../select/SelectDropdown';

export const prepareSelectDropdown = ({
	consultantList,
	handleDatalistSelect,
	value
}) => {
	const selectDropdown: SelectDropdownItem = {
		id: 'assignSelect',
		selectedOptions: consultantList,
		handleDropdownSelect: handleDatalistSelect,
		selectInputLabel: translate('session.u25.assignment.placeholder'),
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

export const prepareConsultantDataForSelect = (
	consultants: Consultant[],
	useFullName = true
) => {
	let availableConsultants = [];
	consultants.forEach((item) => {
		const label = useFullName
			? item.firstName + ` ` + item.lastName
			: item.displayName || decodeUsername(item.username);

		const consultant: SelectOption = {
			value: item.consultantId,
			label,
			iconLabel: item.firstName.charAt(0) + item.lastName.charAt(0)
		};
		availableConsultants.push(consultant);
	});
	return availableConsultants;
};
