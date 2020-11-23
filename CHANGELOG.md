# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.6.1](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/compare/v1.6.0...v1.6.1) (2020-11-23)

## [1.6.0](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/compare/v1.5.1...v1.6.0) (2020-11-23)


### Features

* 🎸 add new special character validation and pw infotext ([5e5d5c3](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/5e5d5c31ee5f9f95bc782a8be218e5e0732b06a3))


### Bug Fixes

* 🐛 fixed registration for offender case ([1db277e](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/1db277e40aafbaa992611c522ba206506ca1d75f))

### [1.5.1](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/compare/v1.5.0...v1.5.1) (2020-11-19)

## [1.5.0](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/compare/v1.4.1...v1.5.0) (2020-11-19)


### Features

* 🎸 added saveDraftMessage on typing/unmount ([d16eed7](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/d16eed7cad8e8bf80c325b33d807fa6f4152fb6f))
* 🎸 added stomp disconnect onLogout, event directMessage ([eea1be0](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/eea1be05b3955fa18f75f03bdc7f0d8939c987b9))
* 🎸 base implementation of stomp & connect to liveservice ([3193d14](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/3193d142932b51233172af807048f02b2e53d5b2))
* 🎸 changed welcome illustration logic & layout ([923cb5a](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/923cb5a0c2ee35952523ba20e5d714debc54e400))
* 🎸 load & display draftMessage on session mount ([8e0e4a9](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/8e0e4a9505887cdd3860a7b27ff9d2e2811e7a3a))
* 🎸 reload list on new directMessage, show animation ([ae2b0e4](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/ae2b0e44647e9455951766a120331f94158baf72))


### Bug Fixes

* 🐛 added textEncoder polyfill for ie11 support ([9bfac36](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/9bfac3681468100bbd2f32b84e7cecdd72b1fb9a))
* 🐛 draft for peer fb checkbox added ([c831b2b](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/c831b2b91eb5e577d98e08b7a67571a085195129))
* 🐛 fix routing and rerenders, memoize routes and session ([88578d5](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/88578d540798ab95c4439eea8448f055058f5160))
* 🐛 ie 11 polyfill ([a1a7bc3](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/a1a7bc3d2ac3e31be3a3c85799b90616a701158e))
* 🐛 unreadMyMessages count for single & group chat ([85ec095](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/85ec09557e18806fcdbf18f58fa93ebcca48b365))
* 🐛 use activeGroupId for draftMessages for feedbackGroups ([cfe2f85](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/cfe2f8559d894667abaaf60993b4410d2466583e))

### [1.4.1](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/compare/v1.4.0...v1.4.1) (2020-10-30)

## [1.4.0](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/compare/v1.3.1...v1.4.0) (2020-10-30)

### Features

-   🎸 add all components to registration for generic cases ([c5be879](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/c5be879654b091e8384bc03838482a86bdf4992b))
-   🎸 add offender to longpostcodevalidation ([2816614](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/2816614e6d510ad5389c81ede68efd74b6521218))
-   🎸 add registration react component ([27bbe25](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/27bbe251897a23f0eb9f4a6b9f849600dbc79d43))
-   🎸 add submit button to registration ([d9a7328](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/d9a73286e6922e1d14033b52dd20ae224e08417c))
-   🎸 import consulting type and registration data ([082de4e](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/082de4e2da99a75eac9b582095d190c3535aa3a9))
-   🎸 validate required registration input fields ([fb660b9](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/fb660b91d0dcce4370c0ab6c36731e94758e042e))

### Bug Fixes

-   🐛 add env var to fix heap out of memory bug ([a482e9a](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/a482e9a66062ef9e42ff7894482888fa02bf3ce3))
-   🐛 add heap fix directly to npm build script ([e266c30](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/e266c30607d9e1598b79dd309026985e695fd9cc))
-   🐛 add password input fields ([b2a67e3](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/b2a67e3edcca22bb8e8207f69f1298904093f6e5))
-   🐛 agencySelection is TeamAgency styles ([2081d2e](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/2081d2e67b337f0aaa82db4f28ce09e25221a429))
-   🐛 change email regex to have better email validation ([6c74187](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/6c74187cada82812ceb06120de9351a6c55e39e1))
-   🐛 fixed condition for new enquiry on listItem click ([d7725ef](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/d7725efbe9c705eb5fdcfa512688181ba792d201))
-   🐛 postcode and agencyid for prefilled aid resorts ([8d7f48b](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/8d7f48b3391f2b72ea88dea12d018cc03c9822b5))
-   🐛 postcode suggestion flyout alignment ([4e10cac](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/4e10cacc30dc5359a3bb4759a9c657e483c0a6e3))
-   🐛 radio button component style import ([fb26aaf](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/fb26aaff868f8ec14a3d25a4a503645887c3290a))
-   🐛 redirect to u25 mail center if letters in aid ([903d437](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/903d437e7fba1c0713d33d1b235e4f4466771f4f))
-   🐛 reg. overlay after button click overlapped by stage ([8ce418b](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/8ce418b59453acbf8c0a7cf795f98c4c4b5c44cf))
-   🐛 remove warning labels only if element not null ([e1be54c](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/e1be54ca01fcb780bd0db414e6d1bb957f19e118))
-   🐛 validation after same user/mail warning ([33a132d](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/33a132d60ba3b78195518b1fcab1bcc8b16a59a1))
-   🐛 validation for "mail and/or username already in use" ([bd218af](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/bd218af508875f45aa84191ad98b199144c0f2e8))

### [1.3.1](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/compare/v1.3.0...v1.3.1) (2020-10-12)

## [1.3.0](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/compare/v1.2.1...v1.3.0) (2020-10-12)

### Features

-   🎸 added stage and login component + login logic ([4e8d870](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/4e8d870fcbd3c16b83e0bc89be110f415367b111))
-   🎸 implemented icon component with variants ([b88c15c](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/b88c15cac2f8b7af56fcab8231839da0359b7237))

### Bug Fixes

-   🐛 added hotfix for draftjs-linkify plugin ([98441b4](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/98441b47718f46ca55ca9e77437baee9ff215328))
-   🐛 fixing editor size for copy, back btn history mobile ([7ba41ec](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/7ba41ec3ac67e3d10eabccb56da0663af66f3453))

### [1.2.1](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/compare/v1.2.0...v1.2.1) (2020-08-25)

## [1.2.0](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/compare/v1.1.0...v1.2.0) (2020-08-25)

### Features

-   🎸 added clickable links to messages & styling ([916beb9](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/916beb92fd88ea7e27996399f54ef4e034a4acc7))

### Bug Fixes

-   🐛 fixed sendToFeedbackChat condition, refactor deprecated ([07e39ce](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/07e39ce9d4ba63d159570710cf405ea0215256b1))

## 1.1.0 (2020-07-29)

### Features

-   🎸 add draftjs emoji picker ([b2e85dc](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/b2e85dc051614ddc485425c24998fc7526e84bc4))
-   🎸 add draftjs richtext editor with toolbar ([70da484](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/70da48418b79e1da7c74d864037e565f2c76cdf4))
-   🎸 add max length to richtext editor ([1c27f78](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/1c27f78e16059e6b0ac826f0f4577ccd7b055913))
-   🎸 add new registration call, overlays + translations ([831dd8f](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/831dd8fb9203a5f1abca7513d3cf4afbf299895c))
-   🎸 add suggestion flyout and add styles for registration ([612f076](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/612f07676fe37afeaf14daea3bd42c596ee8cbae))
-   🎸 add toggle styles to richtext features ([9b51bb6](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/9b51bb68d8ce5d2765f86c6333e5e2c384820b88))
-   🎸 added basic typingIndicator ([565e597](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/565e597924cab886c6d338185c6c49e1c2242e8d))
-   🎸 added getAgencies logic for registration, edge cases ([658d8df](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/658d8df2f81ef2d185e83392c36ac89977ce702a))
-   🎸 added logout after pw change ([79dc6c2](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/79dc6c2ae4ab9b3b8b68c053f798ecad412e2da6))
-   🎸 added maxlength, pattern & disabled to input component ([49a446c](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/49a446cbbcde5e3146c129d3c42549cecb5a15de))
-   🎸 added new enquiry path for second registration ([9f84de3](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/9f84de38cd1108f7d296104a96d45c4a609ae778))
-   🎸 AskerNewRegistration comp., ct select, basic postcode ([f17984f](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/f17984fcdcf02493dc0a00e9b41989e4bad31f86))
-   🎸 implement new upload call, add uploadService masterkey ([2ee7c78](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/2ee7c788118b6a083325b4edc6000302e1a095b6))
-   🎸 implemented typing indicator for group chats ([6ca711c](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/6ca711c49be3573a9920883366ed215e72d77650))
-   🎸 Initial Commit ([c00d10e](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/c00d10eefeb2b17c59b243d0df9e466e495c375b))
-   🎸 new registration with error handling and redirect ([d261303](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/d2613037505f4a1db51aad94165c565338666396))
-   🎸 refactored warning, added agencySelection to register ([0509b1e](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/0509b1e8b8dbafe94061d57b4d1d16661373f404))
-   🎸 refactoring, adding onload & error cases for upload ([f2bdd6b](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/f2bdd6b59192eef28dd406107bfb1de128915100))
-   🎸 wip, prep for new user data structure ([fa74c3e](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/fa74c3e7c3ce3e10b6d3e1e83c5a3fc829c6c194))

### Bug Fixes

-   🐛 add condition to only show city if defined in profile ([31dc880](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/31dc8808d92bb21873d6e1187a5dda44a42a7f87))
-   🐛 add single es6 polyfill functions ([3ba26a7](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/3ba26a7904ff77f1ee7ad63c10e80c4fc93af165))
-   🐛 attachment error for enquiries, profile translation ([4fe6f51](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/4fe6f517265d29f4644aaf36be6e3634e4fcc07b))
-   🐛 emoji popover on textarea resize ([499599c](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/499599c5542c8355db7c00c0a1b6738728112caa))
-   🐛 fixed max file size calculation ([e7c0885](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/e7c0885a0b44bac9531fc4c83701f8b80ca8b6cd))
-   🐛 fixed sessionList view for kreuzbund askers ([183f961](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/183f96174d8a7aebc0a4242df48a07cefc54ee44))
-   🐛 prevent pasted styles in text editor ([f906c52](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/f906c5239732abc0ec6ad7097de8db3470afaf72))
-   🐛 reload userData after new registration ([20e5ac4](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/20e5ac412026666c649d0f0e34d2fbe18604303f))
-   🐛 render markdown messages as html inside message item ([4457b1b](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/4457b1b00275eb189146b104530e1861ea07d5c7))
-   🐛 reset request in progress after file abort ([86aae3f](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/86aae3f43a93b4e26c144d5b3141dc01d0c93be2))
-   🐛 writeEnquiry redirection fix ([a378728](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/a378728f0458376f93c3c2fcbd2abb882ce1f49f))

## 5.4.0 - 2018-03-08

### Changed

-   Switched from normalize.css to sanitize.css

## 5.2.0 - 2018-03-08

### Added

-   Added browserSupport page

### Fixed

-   Fixed problem with handlebars helpers defined in 'resources/js/handlebars.helper.js' not being able to be used by static build [(pr)](https://github.com/biotope/frontend-framework/pull/12)
-   Fixed a css issue in browserMatrix.hbs

## [5.0.6] - 2017-11-30
