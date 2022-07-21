import * as React from 'react';
import './formAccordionItem.styles';
import { ReactComponent as ValidIcon } from '../../resources/img/icons/checkmark.svg';
import { ReactComponent as InvalidIcon } from '../../resources/img/icons/exclamation-mark.svg';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { translate } from '../../utils/translate';
import { AccordionItemValidity } from '../registration/registrationHelpers';

interface FormAccordionItemProps {
	title: string;
	nestedComponent: React.ReactNode;
	index: number;
	isActive: boolean;
	onStepSubmit: Function;
	onItemHeaderClick: Function;
	isLastItem: boolean;
	isValid: AccordionItemValidity;
}

export const FormAccordionItem = (props: FormAccordionItemProps) => {
	const handleStepSubmit = () => {
		props.onStepSubmit(props.index);
	};

	const handleOnHeaderClick = () => {
		props.onItemHeaderClick(props.index);
	};

	const buttonAnswerVideoCall: ButtonItem = {
		title: translate('registration.accordion.item.continueButton.title'),
		label: translate('registration.accordion.item.continueButton'),
		type: BUTTON_TYPES.LINK
	};

	return (
		<div
			className={`formAccordionItem ${
				props.isActive ? 'formAccordionItem--active' : ''
			}`}
			role="tab"
		>
			<div
				className="formAccordionItem__header"
				role="button"
				onClick={handleOnHeaderClick}
			>
				<span className="formAccordionItem__index">{props.index}</span>
				<h3 className="formAccordionItem__title">{props.title}</h3>
				{props.isValid === 'valid' && (
					<ValidIcon className="formAccordionItem__validationIcon formAccordionItem__validationIcon--valid" />
				)}
				{props.isValid === 'invalid' && (
					<InvalidIcon className="formAccordionItem__validationIcon formAccordionItem__validationIcon--invalid" />
				)}
			</div>
			<div className="formAccordionItem__content">
				{props.nestedComponent}
				{!props.isLastItem && (
					<Button
						buttonHandle={handleStepSubmit}
						item={buttonAnswerVideoCall}
						disabled={props.isValid !== 'valid'}
						className="formAccordionItem__continueButton"
						tabIndex={-1}
					/>
				)}
			</div>
		</div>
	);
};
