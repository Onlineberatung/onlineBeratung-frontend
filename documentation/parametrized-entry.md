# Parametrized Entry Documentation

This document describes all available URL parameters that can be used to pre-configure the registration and login flows.

## Overview

The application supports parametrized entry, allowing external systems to deep-link into specific registration flows with pre-filled or pre-selected information. This enables seamless integration with external websites, marketing campaigns, and partner systems.

## Entry Points and Routing Behavior

### Welcome Screen vs. Direct Registration

The application automatically determines which screen to show based on URL parameters:

**Without Parameters:**
- URL: `/` or `/welcome`
- **Behavior:** Shows the welcome screen with "Register" and "Login" buttons
- User must click "Register" to proceed to registration

**With Any Parameter:**
- URL: `/?aid=123` or `/beratung/registration?aid=123`
- **Behavior:** Skips welcome screen and goes directly to registration form
- Applicable parameters: `aid`, `cid`, `postcode`
- This allows direct deep-linking from marketing campaigns or partner sites

### Root Path Redirect

When accessing the root path (`/`), the application checks for URL parameters:
1. If **no parameters** are present → redirects to `/welcome`
2. If **any parameter** is present → redirects to `/beratung/registration` with parameters

This ensures a smooth user experience whether coming from:
- General website (no params → welcome screen)
- Marketing campaign (with params → direct to registration)
- Partner integration (with params → direct to registration)

## URL Parameter Options

### 1. Agency ID (`aid`)
Pre-selects a specific counseling agency during registration.

**Parameter:** `aid`  
**Type:** Number  
**Example:** `?aid=123`  
**Usage:** `/beratung/registration?aid=123` or `/?aid=123`

**Behavior:**
- **Skips welcome screen** and goes directly to registration
- Automatically selects the specified agency in the agency selection step
- If the agency is valid, it will be pre-selected and the postcode field will be disabled
- If the agency ID is invalid, shows an MUI Snackbar warning message and allows normal registration
- Agency-specific legal links (impressum, privacy) will be shown if available
- Works in combination with other parameters

---

### 2. Consultant ID (`cid`)
Pre-selects a specific consultant during registration.

**Parameter:** `cid`  
**Type:** String  
**Example:** `?cid=consultant-uuid`  
**Usage:** `/beratung/registration?cid=consultant-uuid` or `/?cid=consultant-uuid`

**Behavior:**
- **Skips welcome screen** and goes directly to registration
- Automatically assigns the user to the specified consultant
- Used for direct consultant assignments
- Can be combined with agency ID
- Consultant availability is validated

---

### 3. Postcode (`postcode`)
Pre-fills the postcode field and triggers agency search.

**Parameter:** `postcode`  
**Type:** String (5 digits)  
**Example:** `?postcode=12345`  
**Usage:** `/beratung/registration?postcode=12345` or `/?postcode=12345`

**Behavior:**
- **Skips welcome screen** and goes directly to registration
- Pre-fills the postcode in the agency selection form field
- Automatically triggers agency search for the given postcode
- Shows agencies available in that postal code area
- User can change the postcode if needed (field is not disabled)

---

### 4. Topic ID (`tid`)
Pre-selects a specific topic during registration.

**Parameter:** `tid`  
**Type:** Number or String  
**Example:** `?tid=123` or `?tid=topic-name`  
**Usage:** `/beratung/registration?tid=123` or `/?tid=topic-name`

**Behavior:**
- **Skips welcome screen** and goes directly to registration
- Pre-selects the specified topic in the topic selection step
- Topic ID can be numeric or a URL-encoded topic name
- If topic is invalid, user can select from available topics
- Works with agency selection to filter agencies by topic

---

**Note:** Consulting type-specific routes (e.g., `/:consultingTypeSlug/registration`) have been removed. All registration now uses the `/beratung/registration` route.

---

## Combined Parameters

Multiple parameters can be combined for more specific targeting:

### Example 1: Agency + Postcode
```
/beratung/registration?aid=123&postcode=12345
/?aid=123&postcode=12345
```
Pre-selects agency 123, postcode field is disabled, and the agency is shown as pre-selected.

### Example 2: Consultant + Agency
```
/beratung/registration?cid=consultant-uuid&aid=123
/?cid=consultant-uuid&aid=123
```
Routes to specific consultant within a specific agency.

### Example 3: Topic + Postcode
```
/beratung/registration?tid=123&postcode=12345
/?tid=123&postcode=12345
```
- Topic: 123 (pre-selected)
- Postcode: 12345 (pre-filled)
- Agencies filtered by topic and postcode

### Example 4: Full Pre-configuration
```
/beratung/registration?aid=123&cid=consultant-uuid&postcode=12345&tid=456
/?aid=123&cid=consultant-uuid&postcode=12345&tid=456
```
- Agency: 123 (pre-selected, postcode disabled)
- Consultant: consultant-uuid
- Postcode: 12345
- Topic: 456

---

## Login Parameters

The same parameters (`cid`, `aid`) can be used with login URLs:

**Example:**
```
/login?cid=consultant-uuid&aid=123
```

**Behavior:**
- Parameters are preserved through the login flow
- After successful login, user is directed to the appropriate session
- Useful for returning users with direct consultant links

---

## Backend Compatibility

All parametrized entry options are **100% backend compatible**:
- Parameters are passed to backend API calls
- Backend validates agency and consultant IDs
- Backend handles registration with pre-selected values
- No backend changes required for parametrized entry

---

## Use Cases

### 1. Marketing Campaigns
Link directly to specific counseling types with tracking:
```
/addiction/registration?postcode=12345
```

### 2. Partner Websites
Allow partners to link directly to their agency:
```
/beratung/registration?aid=456
```

### 3. Email Communications
Send users directly to their assigned consultant:
```
/login?cid=consultant-uuid&aid=123
```

### 4. QR Codes
Generate QR codes for offline materials with postcode:
```
/beratung/registration?postcode=67890
```

---

## Validation and Error Handling

- **Invalid Agency ID:** System falls back to normal agency selection
- **Invalid Consultant ID:** System proceeds without consultant assignment
- **Invalid Postcode:** System allows manual postcode entry
- **Missing Required Topic:** Error message shown if agency selected before topic (when topics enabled)
