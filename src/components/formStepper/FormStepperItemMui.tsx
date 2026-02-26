import * as React from 'react';
import { styled } from '@mui/material/styles';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import StepIcon from '@mui/material/StepIcon';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { AccordionItemValidity } from '../registration/registrationHelpers';
import { useTranslation } from 'react-i18next';
import './formStepperItem.styles.scss';

interface FormStepperItemMuiProps {
	title: string;
	nestedComponent: React.ReactNode;
	index: number;
	isActive: boolean;
	onStepSubmit: Function;
	isLastItem: boolean;
	isValid: AccordionItemValidity;
	completed: boolean;
}

// Styled MUI Step components using MUI standard icons
const StyledStep = styled(Step)(({ theme }) => ({
	'& .MuiStepLabel-root': {
		padding: '16px 0'
	},
	'& .MuiStepLabel-label': {
		fontSize: '1rem',
		fontWeight: 400,
		'&.Mui-active': {
			fontWeight: 500
		},
		'&.Mui-completed': {
			fontWeight: 400
		}
	},
	'& .MuiStepContent-root': {
		borderLeft: 'none',
		marginLeft: 0,
		paddingLeft: 0,
		paddingRight: 0
	}
}));

const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
	'& .MuiStepLabel-iconContainer': {
		paddingRight: theme.spacing(2)
	},
	// Customize MUI standard StepIcon
	'& .MuiStepIcon-root': {
		width: '32px',
		height: '32px',
		color: '#eaeaea', // Default (inactive) color
		'&.Mui-active': {
			color: theme.palette.primary.main // Active step color
		},
		'&.Mui-completed': {
			color: theme.palette.success.main // Completed step color
		},
		'&.Mui-error': {
			color: theme.palette.error.main // Error step color
		}
	},
	'& .MuiStepIcon-text': {
		fill: '#000', // Default text color
		fontSize: '0.875rem',
		fontWeight: 600
	},
	'& .Mui-active .MuiStepIcon-text': {
		fill: '#fff' // Active step text color
	}
}));

export const FormStepperItemMui = (props: FormStepperItemMuiProps) => {
	const { t: translate } = useTranslation();

	const handleStepSubmit = () => {
		props.onStepSubmit(props.index);
	};

	const buttonNextStep: ButtonItem = {
		title: translate('registration.accordion.item.continueButton.title'),
		label: translate('registration.accordion.item.continueButton.label'),
		type: BUTTON_TYPES.SECONDARY
	};

	// Determine error state for MUI StepIcon
	const hasError = props.isValid === 'invalid' && !props.isActive && !props.completed;

	return (
		<StyledStep
			active={props.isActive}
			completed={props.completed}
			className={`formStepperItem ${props.isActive ? 'formStepperItem--active' : ''}`}
		>
			<StyledStepLabel
				error={hasError}
				className="formStepperItem__label"
			>
				<h4 className="formStepperItem__title">{props.title}</h4>
			</StyledStepLabel>
			<StepContent className="formStepperItem__content">
				{props.nestedComponent}
				{!props.isLastItem && (
					<Button
						buttonHandle={handleStepSubmit}
						item={buttonNextStep}
						disabled={props.isValid !== 'valid'}
						className="formStepperItem__nextbutton"
					/>
				)}
			</StepContent>
		</StyledStep>
	);
};
