import customSelect from 'custom-select';
import { handleSelectWarningLabel } from '../../registrationFormular/ts/warningLabels';

customSelect('select');

const handleSelectStyles = (e: Event) => {
	handleSelectWarningLabel(e);
	const selectOpener = (e.target as HTMLElement).previousElementSibling;
	const selectedOption = selectOpener.querySelector(
		'.custom-select-opener span'
	).innerHTML;
	const firstOption = (e.target as HTMLElement).firstElementChild.innerHTML.trim();
	if (selectedOption === firstOption) {
		selectOpener.classList.remove('custom-select-opener--selected');
	} else {
		selectOpener.classList.add('custom-select-opener--selected');
	}
};

{
	const selectInputs = document.querySelectorAll('.select__input');
	Array.from(selectInputs).forEach((selectInput) => {
		selectInput.addEventListener('change', handleSelectStyles);
	});
}
