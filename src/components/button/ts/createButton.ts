import { translate } from '../../../resources/ts/i18n/translate';

export const createButton = (
	buttonId: string,
	buttonLabel: string,
	buttonStyle?: string,
	buttonValue?: string
) => `
    <div class="button__wrapper">
        <button id="${buttonId}" class="button__item ${
	buttonStyle ? buttonStyle : ''
}" value="${buttonValue ? buttonValue : ''}">${translate(buttonLabel)}</button>
    </div>
`;
