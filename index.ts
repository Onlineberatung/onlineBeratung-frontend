/**
 * This repository is capable to be run as an app directly, but it also exports
 * all relevant parts as modules. This allows a new consumer to own the runtime
 * but reuse as much code from this repository as useful.
 */
// Page components
export { App } from './src/components/app/app';
export { Error } from './src/components/error/Error';

// Component library
export * from './src/components/banner/Banner';
export * from './src/components/headline/Headline';
export * from './src/components/notice/Notice';
export * from './src/components/text/Text';
export * from './src/components/spinner/Spinner';
export * from './src/components/loadingIndicator/LoadingIndicator';
export * from './src/components/button/Button';
export * from './src/components/select/SelectDropdown';
export * from './src/components/stageLayout/StageLayout';
export * from './src/components/overlay/Overlay';
export * from './src/components/serviceExplanation/ServiceExplanation';
export * from './src/components/inputField/InputField';
export * from './src/components/agencySelection/agencySelectionHelpers';
export * from './src/components/profile/AskerRegistrationExternalAgencyOverlay';

// Data
export * from './src/globalState/provider/TenantProvider';

// Hooks
export * from './src/hooks/useAppConfig';
export * from './src/hooks/useE2EE';
export * from './src/hooks/useDebounceCallback';
export * from './src/hooks/useResponsive';
export * from './src/hooks/useSession';
export * from './src/hooks/useSearchParams';
export * from './src/hooks/useStateWithLabel';
export * from './src/hooks/useUnload';
export * from './src/hooks/useUpdatingRef';
export * from './src/hooks/useWatcher';

// Images
export * from './src/resources/img/icons';

// Utils
export { parsePlaceholderString } from './src/utils/parsePlaceholderString';
export * from './src/api';

// Types
export * from './src/globalState';
