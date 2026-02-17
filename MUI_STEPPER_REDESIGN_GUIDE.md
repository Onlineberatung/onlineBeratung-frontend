# MUI Stepper Redesign Implementation Guide

## Overview
This document outlines the complete redesign of the registration stepper to use MUI horizontal stepper with alternative labels, clickable steps, and clean MUI TextField components.

## Requirements Summary

### Visual Design
- ✅ Horizontal stepper (desktop)
- ✅ Alternative labels (labels under step icons)
- ✅ MUI standard step icons with numbers
- ✅ Clickable steps for navigation
- ✅ Error state for incomplete opened steps

### Technical
- ✅ Clean MUI defaults with theme2
- ✅ Minimal custom styles
- ✅ MUI TextField components (registration & login only)
- ✅ Merge username and password into one step
- ✅ 100% content/technical compatibility

## Implementation Steps

### 1. Update FormStepper.tsx

#### Key Changes:
```tsx
// Add at top
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

// Track which steps have been visited
const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

// Handle step click
const handleStepClick = (stepIndex: number) => {
  setVisitedSteps(prev => new Set([...prev, stepIndex]));
  setActiveStep(stepIndex);
};

// Check if step has error (visited but not valid)
const isStepError = (stepIndex: number): boolean => {
  if (!visitedSteps.has(stepIndex)) return false;
  
  switch(stepIndex) {
    case 0: // Topics
      return topicsAreRequired && validity.topic !== VALIDITY_VALID;
    case 1: // Age
      return additionalStepsData?.age?.isEnabled && validity.age !== VALIDITY_VALID;
    case 2: // State
      return additionalStepsData?.state?.isEnabled && validity.state !== VALIDITY_VALID;
    case 3: // Agency
      return validity.agencies !== VALIDITY_VALID;
    case 4: // Username & Password (merged)
      return validity.username !== VALIDITY_VALID || validity.password !== VALIDITY_VALID;
    case 5: // Data Protection
      return !isDataProtectionSelected;
    default:
      return false;
  }
};

// Build steps array
const steps = useMemo(() => {
  const stepsArray = [];
  
  if (topicsAreRequired) {
    stepsArray.push({
      label: translate('registration.topics.headline'),
      component: <MainTopicSelection />,
      valid: validity.topic
    });
  }
  
  if (additionalStepsData?.age?.isEnabled) {
    stepsArray.push({
      label: translate('registration.age.label'),
      component: <RegistrationAge />,
      valid: validity.age
    });
  }
  
  if (additionalStepsData?.state?.isEnabled) {
    stepsArray.push({
      label: translate('registration.state.label'),
      component: <RegistrationState />,
      valid: validity.state
    });
  }
  
  stepsArray.push({
    label: translate('registration.agency.headline'),
    component: <ProposedAgencies />,
    valid: validity.agencies
  });
  
  // MERGED STEP: Username & Password
  stepsArray.push({
    label: translate('registration.credentials.headline'), // New translation key
    component: <RegistrationCredentials />, // New combined component
    valid: validity.username === VALIDITY_VALID && validity.password === VALIDITY_VALID
  });
  
  stepsArray.push({
    label: translate('registration.dataProtection.label'),
    component: (
      <DataProtectionStep
        legalLinks={legalLinks}
        isDataProtectionSelected={isDataProtectionSelected}
        setIsDataProtectionSelected={setIsDataProtectionSelected}
      />
    ),
    valid: isDataProtectionSelected
  });
  
  return stepsArray;
}, [topicsAreRequired, additionalStepsData, validity, isDataProtectionSelected]);

// Mark step as completed
useEffect(() => {
  if (steps[activeStep]?.valid) {
    setCompletedSteps(prev => new Set([...prev, activeStep]));
  }
}, [activeStep, steps]);

// Styled Box for step content
const StepContentBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2),
  minHeight: '400px'
}));

// Return JSX
return (
  <div className="formStepper">
    <Stepper
      activeStep={activeStep}
      alternativeLabel
      orientation="horizontal"
      sx={{
        '.MuiStepConnector-line': {
          borderTopWidth: 2
        }
      }}
    >
      {steps.map((step, index) => (
        <Step
          key={index}
          completed={completedSteps.has(index)}
          onClick={() => handleStepClick(index)}
          sx={{ cursor: 'pointer' }}
        >
          <StepLabel
            error={isStepError(index)}
            StepIconProps={{
              error: isStepError(index)
            }}
          >
            {step.label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
    
    <StepContentBox>
      {steps[activeStep]?.component}
    </StepContentBox>
    
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
      <Button
        disabled={activeStep === 0}
        onClick={() => setActiveStep(activeStep - 1)}
      >
        {translate('registration.backButton')}
      </Button>
      
      {activeStep === steps.length - 1 ? (
        <Button
          variant="contained"
          onClick={handleSubmitButtonClick}
          disabled={isSubmitButtonDisabled}
        >
          {translate('registration.submitButton.label')}
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={() => setActiveStep(activeStep + 1)}
          disabled={!steps[activeStep]?.valid}
        >
          {translate('registration.continueButton')}
        </Button>
      )}
    </Box>
  </div>
);
```

### 2. Create RegistrationCredentials.tsx (Merged Username & Password)

```tsx
import * as React from 'react';
import { useState, useEffect } from 'react';
import { TextField, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  AccordionItemValidity,
  isStringValidUsername,
  isStringValidPassword,
  VALIDITY_INITIAL,
  VALIDITY_INVALID,
  VALIDITY_VALID
} from './registrationHelpers';

interface RegistrationCredentialsProps {
  isUsernameAlreadyInUse: boolean;
  onUsernameChange: Function;
  onPasswordChange: Function;
  onUsernameValidityChange: Function;
  onPasswordValidityChange: Function;
}

export const RegistrationCredentials = ({
  isUsernameAlreadyInUse,
  onUsernameChange,
  onPasswordChange,
  onUsernameValidityChange,
  onPasswordValidityChange
}: RegistrationCredentialsProps) => {
  const { t: translate } = useTranslation();
  
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordRepeat, setPasswordRepeat] = useState<string>('');
  
  const [usernameValid, setUsernameValid] = useState<AccordionItemValidity>(VALIDITY_INITIAL);
  const [passwordValid, setPasswordValid] = useState<AccordionItemValidity>(VALIDITY_INITIAL);
  
  // Username validation
  useEffect(() => {
    if (isUsernameAlreadyInUse) {
      setUsernameValid(VALIDITY_INVALID);
    } else if (username.length === 0) {
      setUsernameValid(VALIDITY_INITIAL);
    } else if (isStringValidUsername(username)) {
      setUsernameValid(VALIDITY_VALID);
    } else {
      setUsernameValid(VALIDITY_INVALID);
    }
  }, [username, isUsernameAlreadyInUse]);
  
  // Password validation
  useEffect(() => {
    if (password.length === 0) {
      setPasswordValid(VALIDITY_INITIAL);
    } else if (isStringValidPassword(password) && password === passwordRepeat) {
      setPasswordValid(VALIDITY_VALID);
    } else {
      setPasswordValid(VALIDITY_INVALID);
    }
  }, [password, passwordRepeat]);
  
  // Notify parent
  useEffect(() => {
    onUsernameChange(username);
    onUsernameValidityChange(usernameValid);
  }, [username, usernameValid]);
  
  useEffect(() => {
    onPasswordChange(password);
    onPasswordValidityChange(passwordValid);
  }, [password, passwordValid]);
  
  const getUsernameHelperText = () => {
    if (isUsernameAlreadyInUse) {
      return translate('registration.user.unavailable');
    }
    if (usernameValid === VALIDITY_INVALID && username.length > 0) {
      return translate('registration.user.unsuitable');
    }
    if (usernameValid === VALIDITY_VALID) {
      return translate('registration.user.suitable');
    }
    return translate('registration.user.infoText');
  };
  
  const getPasswordHelperText = () => {
    if (password.length === 0) {
      return translate('registration.password.infoText');
    }
    if (!isStringValidPassword(password)) {
      return translate('registration.password.unsuitable');
    }
    if (passwordRepeat.length > 0 && password !== passwordRepeat) {
      return translate('registration.password.notEqual');
    }
    if (passwordValid === VALIDITY_VALID) {
      return translate('registration.password.valid');
    }
    return '';
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        label={translate('registration.user.label')}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={usernameValid === VALIDITY_INVALID}
        helperText={getUsernameHelperText()}
        fullWidth
        variant="outlined"
        autoComplete="off"
        inputProps={{ maxLength: 30 }}
      />
      
      <TextField
        label={translate('registration.password.label')}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={passwordValid === VALIDITY_INVALID && password.length > 0}
        helperText={getPasswordHelperText()}
        fullWidth
        variant="outlined"
        autoComplete="new-password"
      />
      
      <TextField
        label={translate('registration.password.confirmation')}
        type="password"
        value={passwordRepeat}
        onChange={(e) => setPasswordRepeat(e.target.value)}
        error={passwordRepeat.length > 0 && password !== passwordRepeat}
        helperText={
          passwordRepeat.length > 0 && password !== passwordRepeat
            ? translate('registration.password.notEqual')
            : ''
        }
        fullWidth
        variant="outlined"
        autoComplete="new-password"
      />
    </Box>
  );
};
```

### 3. Update Login.tsx to Use MUI TextField

```tsx
// In Login.tsx, replace InputField with TextField

<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
  <TextField
    label={translate('login.username.label')}
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    fullWidth
    variant="outlined"
    autoComplete="username"
  />
  
  <TextField
    label={translate('login.password.label')}
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    fullWidth
    variant="outlined"
    autoComplete="current-password"
  />
  
  <Button
    variant="contained"
    fullWidth
    onClick={handleLogin}
    disabled={!username || !password}
  >
    {translate('login.loginButton')}
  </Button>
</Box>
```

### 4. Remove/Minimize Custom SCSS

Delete or minimize:
- `formStepper.styles.scss`
- `formStepperItem.styles.scss`

Use MUI theming instead:
```tsx
const theme = createTheme({
  components: {
    MuiStepper: {
      styleOverrides: {
        root: {
          padding: '24px 0'
        }
      }
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontSize: '0.875rem',
          '&.Mui-active': {
            fontWeight: 500
          }
        }
      }
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          width: 40,
          height: 40,
          '&.Mui-completed': {
            color: '#4caf50'
          },
          '&.Mui-error': {
            color: '#f44336'
          }
        }
      }
    }
  }
});
```

### 5. Add New Translation Keys

```json
{
  "registration": {
    "credentials": {
      "headline": "Zugangsdaten"
    },
    "backButton": "Zurück",
    "continueButton": "Weiter"
  }
}
```

## Testing Checklist

- [ ] Horizontal stepper displays correctly
- [ ] Step labels show under icons
- [ ] Can click on steps to navigate
- [ ] Error icon shows for incomplete visited steps
- [ ] Username & password in same step
- [ ] MUI TextField components work correctly
- [ ] Validation messages display properly
- [ ] Form submission works
- [ ] Mobile responsive
- [ ] Theme colors applied correctly

## Responsive Design

For mobile, consider:
```tsx
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

<Stepper
  activeStep={activeStep}
  alternativeLabel={!isMobile}
  orientation={isMobile ? 'vertical' : 'horizontal'}
>
```

## Notes

- Keep all validation logic unchanged
- Backend API calls unchanged
- Only UI components change
- Test thoroughly on both desktop and mobile
- Ensure accessibility (keyboard navigation, screen readers)
