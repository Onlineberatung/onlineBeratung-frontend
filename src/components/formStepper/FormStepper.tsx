import * as React from 'react';
import {
Dispatch,
SetStateAction,
useCallback,
useContext,
useEffect,
useMemo,
useState
} from 'react';
import { Link } from 'react-router-dom';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';
import './formStepper.styles.scss';
import { useTenant, AgencySpecificContext } from '../../globalState';
import {
RequiredComponentsInterface,
RegistrationNotesInterface
} from '../../globalState/interfaces';
import { RegistrationUsername } from '../registration/RegistrationUsername';
import { RegistrationAge } from '../registration/RegistrationAge';
import { RegistrationState } from '../registration/RegistrationState';
import { RegistrationPassword } from '../registration/RegistrationPassword';
import {
AccordionItemValidity,
VALIDITY_INITIAL,
VALIDITY_VALID
} from '../registration/registrationHelpers';
import { MainTopicSelection } from '../mainTopicSelection/MainTopicSelection';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '../checkbox/Checkbox';
import { Button, BUTTON_TYPES, ButtonItem } from '../button/Button';
import { FormAccordionRegistrationText } from '../formAccordion/FormAccordionRegistrationText';
import { setValueInCookie } from '../sessionCookie/accessSessionCookie';
import { ProposedAgencies } from '../../containers/registration/components/ProposedAgencies/ProposedAgencies';
import { useConsultantRegistrationData } from '../../containers/registration/hooks/useConsultantRegistrationData';
import { FormAccordionData } from '../registration/RegistrationForm';
import { UrlParamsContext } from '../../globalState/provider/UrlParamsProvider';
import { TProvidedLegalLink } from '../../globalState/provider/LegalLinksProvider';
import LegalLinks from '../legalLinks/LegalLinks';

interface FormStepperProps {
formAccordionData: FormAccordionData;
isUsernameAlreadyInUse: boolean;
onChange: (data: Partial<FormAccordionData>) => void;
onValidation: Dispatch<SetStateAction<boolean>>;
additionalStepsData?: RequiredComponentsInterface;
registrationNotes?: RegistrationNotesInterface;
legalLinks: TProvidedLegalLink[];
handleSubmitButtonClick: Function;
isSubmitButtonDisabled: boolean;
setIsDataProtectionSelected: Dispatch<SetStateAction<boolean>>;
isDataProtectionSelected: boolean;
}

export const FormStepper = ({
formAccordionData,
isUsernameAlreadyInUse,
onChange,
onValidation,
additionalStepsData,
registrationNotes,
legalLinks,
handleSubmitButtonClick,
isSubmitButtonDisabled,
setIsDataProtectionSelected,
isDataProtectionSelected
}: FormStepperProps) => {
const { t: translate } = useTranslation(['common', 'consultingTypes']);
const tenantData = useTenant();

const { consultingType, consultant } = useContext(UrlParamsContext);
const { setSpecificAgency, specificAgency } = useContext(
AgencySpecificContext
);
const { consultingTypes } = useConsultantRegistrationData({});

const [activeStep, setActiveStep] = useState<number>(0);
const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));

const topicsAreRequired = useMemo(
() =>
tenantData?.settings?.topicsInRegistrationEnabled &&
tenantData?.settings?.featureTopicsEnabled,
[tenantData?.settings]
);

const buttonItemSubmit: ButtonItem = {
label: translate('registration.submitButton.label'),
type: BUTTON_TYPES.PRIMARY
};

const [validity, setValidity] = useState({
username: VALIDITY_INITIAL,
password: VALIDITY_INITIAL,
state: additionalStepsData?.state?.isEnabled
? VALIDITY_INITIAL
: VALIDITY_VALID,
age: additionalStepsData?.age?.isEnabled
? VALIDITY_INITIAL
: VALIDITY_VALID,
mainTopic: topicsAreRequired ? VALIDITY_INITIAL : VALIDITY_VALID,
agency: VALIDITY_INITIAL,
dataProtection: VALIDITY_INITIAL
});

useEffect(() => {
// different data protection between agencies
formAccordionData.agency?.tenantId &&
setValueInCookie(
'tenantId',
formAccordionData.agency?.tenantId
? formAccordionData.agency?.tenantId?.toString()
: '0'
);
formAccordionData.agency?.tenantId &&
setIsDataProtectionSelected(false);
setSpecificAgency(formAccordionData.agency);
}, [
formAccordionData.agency,
setSpecificAgency,
setIsDataProtectionSelected
]);

useEffect(() => {
onValidation(
Object.values(validity).every(
(validity) => validity === VALIDITY_VALID
)
);
}, [onValidation, validity]);

const handleValidity = useCallback((key, value) => {
setValidity((prevState) => ({
...prevState,
[key]: value
}));
}, []);

useEffect(() => {
if (isUsernameAlreadyInUse) {
setActiveStep(0);
}
}, [isUsernameAlreadyInUse]);

useEffect(() => {
handleValidity(
'dataProtection',
isDataProtectionSelected ? VALIDITY_VALID : VALIDITY_INITIAL
);
}, [handleValidity, isDataProtectionSelected]);

const handleStepClick = (stepIndex: number) => {
setActiveStep(stepIndex);
setVisitedSteps((prev) => new Set([...prev, stepIndex]));
};

const handleNext = () => {
const nextStep = activeStep + 1;
setActiveStep(nextStep);
setVisitedSteps((prev) => new Set([...prev, nextStep]));
};

const handleKeyDown = (e, isLastInput = true, isFirstInput = true) => {
if (
e.key === 'Tab' &&
!e.shiftKey &&
isLastInput &&
activeStep !== stepperItemData.length - 1
) {
setActiveStep(activeStep + 1);
} else if (
e.key === 'Tab' &&
e.shiftKey &&
isFirstInput &&
activeStep !== 0
) {
setActiveStep(activeStep - 1);
}
};

const isStepError = (stepIndex: number, stepData: any): boolean => {
// Don't mark the currently active step as error
if (stepIndex === activeStep) return false;
// Only mark as error if step was visited but left without proper validation
if (!visitedSteps.has(stepIndex)) return false;
return stepData && stepData.isValid !== VALIDITY_VALID;
};

// Build registration steps in the correct order:
// 1. Topics (if enabled) - must be first to enable agency selection
// 2. Age (if enabled)
// 3. State (if enabled)
// 4. Agency selection - requires topic to be selected first
// 5. Username
// 6. Password
// 7. Data protection
const stepperItemData = [];

// Step 1: Topic Selection (if topics are required)
if (topicsAreRequired) {
stepperItemData.push({
title: translate('registration.mainTopic.headline'),
nestedComponent: (
<MainTopicSelection
name="mainTopic"
value={formAccordionData.mainTopic}
onChange={(topic) => onChange({ mainTopic: topic })}
onValidityChange={handleValidity}
/>
),
isValid: validity.mainTopic
});
}

// Step 2: Age Selection (if enabled)
if (additionalStepsData?.age?.isEnabled) {
stepperItemData.push({
title: translate('registration.age.headline'),
nestedComponent: (
<RegistrationAge
dropdownSelectData={{
label: translate('registration.age.dropdown'),
options: additionalStepsData.age.options.map(
(option) => ({
...option,
label: translate(
[
`consultingType.${consultingType.id}.requiredComponents.age.${option.value}`,
`consultingType.fallback.requiredComponents.age.${option.value}`,
option.label
],
{ ns: 'consultingTypes' }
)
})
)
}}
onAgeChange={(age) => onChange({ age })}
onValidityChange={(validity) =>
handleValidity('age', validity)
}
onKeyDown={handleKeyDown}
/>
),
isValid: validity.age
});
}

// Step 3: State Selection (if enabled)
if (additionalStepsData?.state?.isEnabled) {
// we want an array from 1 to 16 and the 0 at the end
let countiesArray = Array.from(Array(17).keys());
countiesArray.push(countiesArray.shift());

stepperItemData.push({
title: translate('registration.state.headline'),
nestedComponent: (
<RegistrationState
dropdownSelectData={{
label: translate('registration.state.dropdown'),
options: countiesArray.map((value) => ({
value: `${value}`,
label: translate(
`registration.state.options.${value}`
)
}))
}}
onStateChange={(state) => onChange({ state })}
onValidityChange={(validity) =>
handleValidity('state', validity)
}
onKeyDown={handleKeyDown}
/>
),
isValid: validity.state
});
}

// Step 4: Agency Selection
const agencySelectionTitle = useMemo(() => {
let key = 'agency';
if (consultant) {
key =
consultingTypes.length > 1
? 'consultingTypeAgencySelection.consultingType'
: 'consultingTypeAgencySelection.agency';
} else if (!consultingType?.registration?.autoSelectPostcode) {
key = consultingType?.registration?.autoSelectAgency
? 'agencyPreselected'
: 'agencySelection';
}
return `registration.${key}.headline`;
}, [consultant, consultingType, consultingTypes.length]);

stepperItemData.push({
title: translate(agencySelectionTitle),
nestedComponent: (
<ProposedAgencies
agencySelectionNote={registrationNotes?.agencySelection}
onValidityChange={handleValidity}
formAccordionData={formAccordionData}
onChange={onChange}
onKeyDown={handleKeyDown}
/>
),
isValid: validity.agency
});

// Step 5: Username
stepperItemData.push({
title: translate('registration.username.headline'),
nestedComponent: (
<RegistrationUsername
isUsernameAlreadyInUse={isUsernameAlreadyInUse}
onUsernameChange={(username) => onChange({ username })}
onValidityChange={(validity) =>
handleValidity('username', validity)
}
onKeyDown={handleKeyDown}
/>
),
isValid: validity.username
});

// Step 6: Password
stepperItemData.push({
title: translate('registration.password.headline'),
nestedComponent: (
<RegistrationPassword
onPasswordChange={(password) => onChange({ password })}
onValidityChange={(validity) =>
handleValidity('password', validity)
}
passwordNote={registrationNotes?.password}
onKeyDown={handleKeyDown}
/>
),
isValid: validity.password
});

// Step 7: Data Protection
stepperItemData.push({
title: translate('registration.form.title'),
nestedComponent: (
<div>
<div
className="registrationForm__dataProtection"
onKeyDown={handleKeyDown}
>
<Checkbox
checkboxHandle={() =>
setIsDataProtectionSelected(
!isDataProtectionSelected
)
}
onKeyPress={(event) => {
if (event.key === 'Enter') {
setIsDataProtectionSelected(
!isDataProtectionSelected
);
}
}}
inputId={'dataProtectionCheckbox'}
name={'dataProtectionCheckbox'}
labelId={'dataProtectionLabel'}
checked={isDataProtectionSelected}
>
<LegalLinks
prefix={translate(
'registration.dataProtection.label.prefix'
)}
delimiter={', '}
lastDelimiter={translate(
'registration.dataProtection.label.and'
)}
suffix={translate(
'registration.dataProtection.label.suffix'
)}
filter={(legalLink) => legalLink.registration}
legalLinks={legalLinks}
params={{ aid: specificAgency?.id }}
>
{(label, url) => (
<span>
<Link to={url} className="button-as-link">
{label}
</Link>
</span>
)}
</LegalLinks>
</Checkbox>
</div>
<FormAccordionRegistrationText
agency={formAccordionData.agency}
/>
<Button
className="registrationForm__submit"
item={buttonItemSubmit}
buttonHandle={handleSubmitButtonClick}
disabled={isSubmitButtonDisabled}
/>
</div>
),
isValid: validity.dataProtection
});

return (
<div className="formStepper">
<Stepper 
activeStep={activeStep} 
orientation="horizontal"
alternativeLabel
sx={{ mb: 4 }}
>
{stepperItemData.map((stepperItem, i) => {
const isCompleted = i < activeStep;
const isError = isStepError(i, stepperItem);

return (
<Step 
key={i}
completed={isCompleted}
>
<StepLabel
error={isError}
onClick={() => handleStepClick(i)}
sx={{ cursor: 'pointer' }}
>
{stepperItem.title}
</StepLabel>
</Step>
);
})}
</Stepper>
<Box sx={{ mt: 3 }}>
{stepperItemData[activeStep] && (
<>
{stepperItemData[activeStep].nestedComponent}
{activeStep < stepperItemData.length - 1 && (
<Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
{activeStep > 0 && (
<Button
item={{
label: translate('app.back'),
type: BUTTON_TYPES.SECONDARY
}}
buttonHandle={handleStepBack}
/>
)}
<Button
item={{
label: translate('app.next'),
type: BUTTON_TYPES.PRIMARY
}}
buttonHandle={handleNext}
disabled={stepperItemData[activeStep].isValid !== VALIDITY_VALID}
/>
</Box>
)}
</>
)}
</Box>
</div>
);
};
