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

// Utils
export { translate } from './src/utils/translate';

// Types
export * from './src/globalState';
