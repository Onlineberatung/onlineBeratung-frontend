/**
 * This repository is capable to be run as an app directly, but it also exports
 * all relevant parts as modules. This allows a new consumer to own the runtime
 * but reuse as much code from this repository as useful.
 */

export { App } from './src/components/app/app';
export { Login } from './src/components/login/Login';
export { Error } from './src/components/error/Error';
export { default as defaultLocale } from './src/resources/scripts/i18n/defaultLocale';
export { default as informalLocale } from './src/resources/scripts/i18n/informalLocale';
export * from './src/globalState';
