# Weblate Translation Import Files

This folder contains translation files for import into Weblate for localization management.

## Files

### de-new-translations.json
German (formal) translations for new strings added in this PR.

### de-informal-new-translations.json
German (informal/Du) translations for new strings added in this PR.

## Usage

These files can be imported into Weblate to add the new translation strings to the translation database.

### Import Instructions

1. Log into Weblate
2. Navigate to the project: "Online Beratung Frontend"
3. Select the appropriate language (de or de@informal)
4. Click "Files" → "Upload translation"
5. Select the corresponding JSON file
6. Choose merge method: "Add as translation"
7. Click "Upload"

## Translation Keys Added

All keys follow the existing i18n structure and are added to `common.json`:

### Registration Flow
- `registration.agency.error.topicRequired` - Error when agency selection attempted without topic
- `registration.headline` - Page title for registration
- `registration.intro.seoDescription` - Meta description for SEO
- `registration.intro.seoKeywords` - Meta keywords for SEO

### Login Flow
- `login.headline` - Page title for login (already exists, included for completeness)
- `login.intro.seoDescription` - Meta description for SEO
- `login.intro.seoKeywords` - Meta keywords for SEO

### User Profile / Asker Info
- `userProfile.data.topic` - Label for the consulting topic field in the asker info panel

## Notes

- The `legal.back` translation already exists and is reused (not included here)
- All new translations follow the existing naming conventions
- Both formal and informal variants provided where applicable
- SEO translations help with search engine optimization
