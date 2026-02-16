# Parametrized Entry Documentation

This document describes all available URL parameters that can be used to pre-configure the registration and login flows.

## Overview

The application supports parametrized entry, allowing external systems to deep-link into specific registration flows with pre-filled or pre-selected information. This enables seamless integration with external websites, marketing campaigns, and partner systems.

## URL Parameter Options

### 1. Agency ID (`aid`)
Pre-selects a specific counseling agency during registration.

**Parameter:** `aid`  
**Type:** Number  
**Example:** `?aid=123`  
**Usage:** `/beratung/registration?aid=123`

**Behavior:**
- Automatically selects the specified agency in the agency selection step
- If the agency is valid, it will be pre-selected
- Agency-specific legal links (impressum, privacy) will be shown if available
- Works in combination with other parameters

---

### 2. Consultant ID (`cid`)
Pre-selects a specific consultant during registration.

**Parameter:** `cid`  
**Type:** String  
**Example:** `?cid=consultant-uuid`  
**Usage:** `/beratung/registration?cid=consultant-uuid`

**Behavior:**
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
**Usage:** `/beratung/registration?postcode=12345`

**Behavior:**
- Skips the welcome screen (if `postcode` parameter is present)
- Pre-fills the postcode in the agency selection
- Automatically triggers agency search for the given postcode
- Shows agencies available in that postal code area
- If no postcode parameter is provided, welcome screen is shown

---

### 4. Consulting Type Slug
Selects a specific type of counseling service.

**Parameter:** Route parameter in URL path  
**Type:** String  
**Example:** `/addiction/registration` or `/beratung/registration`  
**Usage:** `/:consultingTypeSlug/registration`

**Behavior:**
- Routes to specific consulting type (e.g., "addiction", "beratung")
- Loads consulting-type-specific configuration
- Shows consulting-type-specific content and branding
- Falls back to default if slug is not recognized

---

## Combined Parameters

Multiple parameters can be combined for more specific targeting:

### Example 1: Agency + Postcode
```
/beratung/registration?aid=123&postcode=12345
```
Pre-selects agency 123 and shows it's available in postcode 12345.

### Example 2: Consultant + Agency
```
/beratung/registration?cid=consultant-uuid&aid=123
```
Routes to specific consultant within a specific agency.

### Example 3: Full Pre-configuration
```
/addiction/registration?aid=123&cid=consultant-uuid&postcode=12345
```
- Consulting type: addiction counseling
- Agency: 123
- Consultant: consultant-uuid
- Postcode: 12345

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
