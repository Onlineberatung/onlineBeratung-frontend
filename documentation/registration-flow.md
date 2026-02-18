# Registration Flow Documentation

This document describes the complete user registration flow in the online counseling platform.

## Overview

The registration process guides users through multiple steps to create an account and connect with appropriate counseling services. The flow is designed to be intuitive, accessible, and configurable based on tenant settings.

## Flow Diagram

```
Entry Point (with/without parameters)
         ↓
[Welcome Screen] (optional - skipped if postcode parameter present)
         ↓
[Registration Steps - Accordion]
    ├─ Step 1: Topic Selection (if topics enabled)
    ├─ Step 2: Age Selection (if age required)
    ├─ Step 3: State Selection (if state required)
    ├─ Step 4: Agency Selection
    ├─ Step 5: Username Selection
    ├─ Step 6: Password Creation
    └─ Step 7: Data Protection Agreement
         ↓
[Account Creation]
         ↓
[Auto-Login]
         ↓
[Redirect to Chat/Dashboard]
```

## Detailed Step-by-Step Flow

### Entry Points

Users can enter the registration flow through multiple routes:

1. **Standard Entry:** `/beratung/registration`
2. **Consulting Type Specific:** `/:consultingTypeSlug/registration` (e.g., `/addiction/registration`)
3. **With Parameters:** `/beratung/registration?aid=123&postcode=12345`
4. **From Login Page:** Click "Register" link on `/login`

### Step 0: Welcome Screen (Optional)

**Display Condition:** Shown when NO `postcode` parameter is present in URL

**Purpose:**
- Introduce the service
- Explain counseling type (if applicable)
- Provide overview of registration process
- Offer choice to register or login

**Components:**
- Consulting type name (if not hidden in config)
- Welcome headline
- Service explanation
- "Register Now" button (primary action)
- "Already have an account? Login" button (secondary action)

**User Actions:**
- Click "Register Now" → Proceeds to Step 1
- Click "Login" → Navigates to `/login`

**Skip Condition:**
If URL contains `?postcode=12345`, welcome screen is skipped and user goes directly to registration form with postcode pre-filled.

---

### Step 1: Topic Selection (Conditional)

**Display Condition:** Only shown if topics are enabled for the tenant

**Purpose:** Select the main counseling topic/issue

**Validation:**
- At least one topic must be selected
- Cannot proceed to agency selection without topic (enforced)

**Error Handling:**
- If user tries to jump to agency step without topic: Error message shown
- Message: "Bitte wählen Sie zunächst ein Thema aus, um passende Beratungsstellen zu finden."

**User Actions:**
- Select radio button for desired topic
- Click "Continue" to proceed to next step

**Backend Integration:**
- Selected topic ID sent with registration
- Used to filter available agencies
- Stored with user profile

---

### Step 2: Age Selection (Conditional)

**Display Condition:** Only if age is required in consulting type configuration

**Purpose:** Collect user's age range for appropriate counseling

**Input:**
- Dropdown select with predefined age ranges
- Options configured per consulting type
- Typically: "14-17", "18-25", "26-35", "36-50", "51-65", "65+"

**Validation:**
- Required field
- Must select an option to continue

**User Actions:**
- Select age range from dropdown
- Click "Continue" to proceed

---

### Step 3: State Selection (Conditional)

**Display Condition:** Only if state/region is required

**Purpose:** Determine user's geographic location for regional services

**Input:**
- Dropdown select with German federal states (Bundesländer)
- Options: All 16 German states

**Validation:**
- Required field
- Must select a state to continue

**User Actions:**
- Select state from dropdown
- Click "Continue" to proceed

---

### Step 4: Agency Selection (Required)

**Purpose:** Select counseling agency to provide services

**Two Selection Methods:**

#### A. By Postcode (if enabled)
**Flow:**
1. User enters 5-digit postcode
2. System searches for agencies in that area
3. List of matching agencies displayed
4. User selects one agency from list

**Pre-filling:**
- If `?postcode=12345` in URL, postcode is pre-filled
- If `?aid=123` in URL, agency is pre-selected

#### B. Direct Selection (if postcode disabled)
**Flow:**
1. Dropdown with all available agencies
2. User selects agency directly

**Validation:**
- Required field
- Must select agency to continue
- If topics enabled: Cannot select agency without first selecting topic
- Shows error if no agencies match selected topic + postcode

**Error Messages:**
- No topic selected: "Bitte wählen Sie zunächst ein Thema aus..."
- No agencies found: "Keine passenden Beratungsstellen gefunden"

**Agency Display:**
- Agency name
- Agency logo (if available)
- Team indicator (if team-based agency)
- Consultant name (if `?cid=` parameter present)

**User Actions:**
- Enter postcode (if postcode method)
- Click "Search" to find agencies
- Select agency from results
- Click "Continue" to proceed

---

### Step 5: Username Selection (Required)

**Purpose:** Create unique username for login

**Input:**
- Text field for username
- Real-time availability check

**Validation Rules:**
- Minimum length: 3 characters
- Maximum length: 255 characters
- Must be unique (checked against database)
- No special characters (depends on backend rules)

**Real-time Feedback:**
- ✓ Username available (green checkmark)
- ✗ Username already taken (red error)
- Shows validation state immediately

**User Actions:**
- Type desired username
- System checks availability in real-time
- Click "Continue" when username is valid and available

**Error Handling:**
- "Benutzername ist bereits vergeben" if taken
- "Benutzername ist zu kurz" if too short

---

### Step 6: Password Creation (Required)

**Purpose:** Create secure password for account

**Input:**
- Password field (hidden input)
- Password confirmation field (hidden input)

**Password Requirements:**
- Minimum 9 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

**Real-time Validation:**
Each requirement shown with status indicator:
- ✓ Fulfilled (green)
- ✗ Not fulfilled (red)

**Validation Rules:**
- Both fields must match
- All requirements must be met
- Cannot proceed with weak password

**User Actions:**
- Enter password
- Enter password confirmation
- Click "Continue" when all requirements met

**Error Handling:**
- "Passwörter stimmen nicht überein" if mismatch
- Individual requirement messages for each unmet criterion

---

### Step 7: Data Protection Agreement (Required)

**Purpose:** User consent for terms, privacy policy, and data protection

**Components:**
- Checkbox for agreement
- Text with embedded links to:
  - Terms and Conditions (Nutzungsbedingungen)
  - Privacy Policy (Datenschutzerklärung)
  - Imprint (Impressum) - if applicable

**Links Behavior:**
- Open as SPA routes (no new tab)
- Navigate to `/nutzungsbedingungen`, `/datenschutz`, `/impressum`
- Back button returns to registration (state preserved)
- Sticky back button visible while scrolling

**Validation:**
- Checkbox must be checked
- Cannot submit without agreement

**User Actions:**
- Read linked documents (optional)
- Check agreement checkbox
- Click "Register" to submit

---

### Step 8: Account Creation

**Backend Processing:**
1. Validate all form data
2. Check username availability again
3. Hash password securely
4. Create user account in database
5. Assign to selected agency
6. Assign to consultant (if specified)
7. Link topic selection
8. Store age and state (if collected)

**API Call:**
```
POST /users/registration
{
  username: "user123",
  password: "hashed_password",
  agencyId: 123,
  consultantId: "uuid",
  topicId: 456,
  age: "18-25",
  state: "Bayern"
}
```

---

### Step 9: Auto-Login

**Automatic Process:**
1. Account created successfully
2. System automatically logs in user
3. Session established
4. Authentication token generated

**Purpose:**
- Seamless user experience
- No need to manually login after registration
- Immediate access to counseling services

---

### Step 10: Redirect

**Final Step:** User redirected to appropriate view

**Destination Options:**
1. **Standard:** Dashboard/Session view
2. **With Consultant:** Direct to consultant chat
3. **With Agency:** Agency-specific welcome message

**URL Examples:**
- `/sessions/user/view`
- `/sessions/user/view?cid=consultant-uuid`

---

## Special Flows

### Consultant-Specific Registration

When `?cid=consultant-uuid` parameter present:

1. Agency selection may be automatic
2. Consultant assigned immediately
3. User directed to specific consultant chat
4. Consultant notified of new user

### Agency-Specific Registration

When `?aid=123` parameter present:

1. Agency pre-selected in Step 4
2. Agency logo shown
3. Agency-specific legal links displayed
4. Registration data associated with agency

### Topic-First Registration

When topics are enabled:

1. Topic selection is FIRST step (Step 1)
2. Agency list filtered by selected topic
3. Cannot proceed to agency without topic
4. Clear error messaging

---

## Error Handling

### Network Errors
- "Verbindung zum Server fehlgeschlagen"
- Retry mechanism available
- Form data preserved

### Validation Errors
- Inline error messages per field
- Cannot proceed past step with errors
- Clear indication of what needs fixing

### Backend Errors
- Username taken: Real-time feedback
- Agency unavailable: Alternative suggestions
- Consultant unavailable: Fallback to agency

---

## Mobile Responsiveness

All steps are fully responsive:
- Single column layout on mobile
- Touch-friendly buttons and inputs
- Optimized form fields for mobile keyboards
- Sticky headers and footers
- Swipe gestures (future enhancement)

---

## Accessibility

- Full keyboard navigation
- Screen reader compatible
- ARIA labels on all interactive elements
- Clear focus indicators
- Error announcements
- Progress indication

---

## Backward Compatibility

The registration flow maintains 100% backward compatibility:
- Old URLs still work
- Parameters preserved
- API contracts unchanged
- Graceful fallbacks for missing features

---

## Configuration Options

Tenant-specific configuration:

```typescript
interface RegistrationConfig {
  topicsEnabled: boolean;
  ageRequired: boolean;
  stateRequired: boolean;
  postcodeMethod: boolean;
  autoSelectAgency: boolean;
  autoSelectPostcode: boolean;
  welcomeScreenHidden: boolean;
}
```

Each tenant can customize which steps appear in their registration flow.

---

## Future Enhancements

Planned improvements:
- Multi-step progress bar
- Save and resume later
- Email verification step
- SMS verification option
- Social media login integration
- Anonymous registration option
