/**
 * This repository is capable to be run as an app directly, but it also exports
 * all relevant parts as modules. This allows a new consumer to own the runtime
 * but reuse as much code from this repository as useful.
 */

// Page components
export { App } from './src/components/app/app';
export { Login } from './src/components/login/Login';
export { Error } from './src/components/error/Error';

// Component library
export { Headline } from './src/components/headline/Headline';
export { Text } from './src/components/text/Text';
export { Button, BUTTON_TYPES } from './src/components/button/Button';
export { SelectDropdown } from './src/components/select/SelectDropdown';
export { StageLayout } from './src/components/stageLayout/StageLayout';

// Images
export * from './src/resources/img/icons';

// Utils
export { translate } from './src/utils/translate';
export * from './src/api/fetchData';

// Types
export * from './src/globalState';
