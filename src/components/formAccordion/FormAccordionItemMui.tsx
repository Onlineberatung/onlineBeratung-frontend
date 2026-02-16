import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
	AccordionSummaryProps
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ValidIcon from '../../resources/img/icons/checkmark_filled.svg?react';
import InvalidIcon from '../../resources/img/icons/exclamation-mark.svg?react';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { AccordionItemValidity } from '../registration/registrationHelpers';
import { useTranslation } from 'react-i18next';
import './formAccordionItem.styles.scss';

interface FormAccordionItemMuiProps {
	title: string;
	nestedComponent: React.ReactNode;
	index: number;
	isActive: boolean;
	onStepSubmit: Function;
	onItemHeaderClick: Function;
	isLastItem: boolean;
	isValid: AccordionItemValidity;
}

// Styled MUI Accordion to match existing design
const Accordion = styled((props: AccordionProps) => (
	<MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
	'&:before': {
		display: 'none'
	},
	'&.Mui-expanded': {
		margin: 0
	}
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary {...props} />
))(() => ({
	flexDirection: 'row',
	'& .MuiAccordionSummary-content': {
		margin: 0,
		alignItems: 'center'
	},
	'&.Mui-expanded': {
		minHeight: 'auto'
	}
}));

const AccordionDetails = styled(MuiAccordionDetails)(() => ({
	padding: 0,
	display: 'block'
}));

export const FormAccordionItemMui = (props: FormAccordionItemMuiProps) => {
	const { t: translate } = useTranslation();
	const handleStepSubmit = () => {
		props.onStepSubmit(props.index);
	};

	const handleChange = () => {
		if (!props.isActive) {
			props.onItemHeaderClick(props.index);
		}
	};

	const buttonNextStep: ButtonItem = {
		title: translate('registration.accordion.item.continueButton.title'),
		label: translate('registration.accordion.item.continueButton.label'),
		type: BUTTON_TYPES.SECONDARY
	};

	return (
		<Accordion
			expanded={props.isActive}
			onChange={handleChange}
			className={`formAccordionItem ${
				props.isActive ? 'formAccordionItem--active' : ''
			}`}
		>
			<AccordionSummary
				className="formAccordionItem__header"
				aria-controls={`panel${props.index}-content`}
				id={`panel${props.index}-header`}
			>
				<span className="formAccordionItem__index">{props.index}</span>
				<h4 className="formAccordionItem__title">{props.title}</h4>
				{props.isValid === 'valid' && (
					<ValidIcon
						aria-label={translate('app.successful')}
						title={translate('app.successful')}
						className="formAccordionItem__validationIcon formAccordionItem__validationIcon--valid"
					/>
				)}
				{props.isValid === 'invalid' && (
					<InvalidIcon
						aria-label={translate('app.faulty')}
						title={translate('app.faulty')}
						className="formAccordionItem__validationIcon formAccordionItem__validationIcon--invalid"
					/>
				)}
			</AccordionSummary>
			<AccordionDetails className="formAccordionItem__content">
				{props.nestedComponent}
				{!props.isLastItem && (
					<Button
						buttonHandle={handleStepSubmit}
						item={buttonNextStep}
						disabled={props.isValid !== 'valid'}
						className="formAccordionItem__nextbutton"
					/>
				)}
			</AccordionDetails>
		</Accordion>
	);
};
