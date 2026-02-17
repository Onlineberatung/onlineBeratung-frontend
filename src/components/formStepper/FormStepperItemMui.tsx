import * as React from 'react';
import { styled } from '@mui/material/styles';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import ValidIcon from '../../resources/img/icons/checkmark_filled.svg?react';
import InvalidIcon from '../../resources/img/icons/exclamation-mark.svg?react';
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

// Styled MUI Step components to match existing design
const StyledStep = styled(Step)(({ theme }) => ({
'& .MuiStepLabel-root': {
padding: '16px 0',
cursor: 'pointer'
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

// Custom step icon with validation state
const StepIcon = () => {
return (
<span className="formStepperItem__iconWrapper">
<span className="formStepperItem__index">{props.index}</span>
{props.isValid === 'valid' && props.completed && (
<ValidIcon
aria-label={translate('app.successful')}
title={translate('app.successful')}
className="formStepperItem__validationIcon formStepperItem__validationIcon--valid"
/>
)}
{props.isValid === 'invalid' && !props.isActive && (
<InvalidIcon
aria-label={translate('app.faulty')}
title={translate('app.faulty')}
className="formStepperItem__validationIcon formStepperItem__validationIcon--invalid"
/>
)}
</span>
);
};

return (
<StyledStep
active={props.isActive}
completed={props.completed}
className={`formStepperItem ${
props.isActive ? 'formStepperItem--active' : ''
}`}
>
<StyledStepLabel
StepIconComponent={StepIcon}
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
