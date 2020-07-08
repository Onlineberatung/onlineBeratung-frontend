import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { SendMessageButton } from './SendMessageButton';
import {
	typeIsEnquiry,
	isGroupChatForSessionItem
} from '../../session/ts/sessionHelpers';
import { Checkbox, CheckboxItem } from '../../checkbox/ts/Checkbox';
import { translate } from '../../../resources/ts/i18n/translate';
import { UserDataContext } from '../../../globalState/provider/UserDataProvider';
import {
	getActiveSession,
	getContact,
	hasUserAuthority,
	AUTHORITIES
} from '../../../globalState/helpers/stateHelpers';
import {
	ActiveSessionGroupIdContext,
	SessionsDataContext
} from '../../../globalState';
import {
	ajaxSendEnquiry,
	ajaxSendMessage,
	ajaxCallUploadAttachment
} from '../../apiWrapper/ts';
import {
	MessageSubmitInfo,
	MessageSubmitInfoInterface
} from './MessageSubmitInfo';
import {
	isJPEGAttachment,
	isPNGAttachment,
	isPDFAttachment,
	isDOCXAttachment,
	getAttachmentSizeMBForKB,
	isXLSXAttachment,
	ATTACHMENT_MAX_SIZE_IN_MB
} from './attachmentHelpers';
import { TypingIndicator } from '../../typingIndicator/ts/typingIndicator';
import PluginsEditor from 'draft-js-plugins-editor';
import {
	EditorState,
	RichUtils,
	DraftHandleValue,
	convertToRaw
} from 'draft-js';
import { draftToMarkdown } from 'markdown-draft-js';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
import {
	ItalicButton,
	BoldButton,
	UnorderedListButton
} from 'draft-js-buttons';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import {
	emojiPickerCustomClasses,
	toolbarCustomClasses,
	handleEditorBeforeInput,
	handleEditorPastedText
} from './richtextHelpers';

//Linkify Plugin
const linkifyPlugin = createLinkifyPlugin();

//Static Toolbar Plugin
const staticToolbarPlugin = createToolbarPlugin({
	theme: toolbarCustomClasses
});
const { Toolbar } = staticToolbarPlugin;

//Emoji Picker Plugin
const emojiSelectButtonIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		width="20"
		height="20"
		viewBox="0 0 72 72"
	>
		<defs>
			<path
				id="smiley-positive-a"
				d="M61.9805542,20.9445849 C64.6640739,25.5411239 66,30.5576512 66,36 C66,41.448182 64.6640739,46.4588761 61.9805542,51.0612483 C59.3028683,55.6519541 55.6567817,59.291853 51.0656296,61.9751118 C46.4686437,64.6525374 41.4457948,66 36.0029169,66 C30.5600389,66 25.5430238,64.6525374 20.9460379,61.9751118 C16.349052,59.291853 12.7087992,55.6519541 10.0252795,51.0612483 C7.34759358,46.4588761 6,41.448182 6,36 C6,30.5576512 7.34759358,25.5411239 10.0252795,20.9445849 C12.7087992,16.3480459 16.349052,12.708147 20.9460379,10.0248882 C25.5430238,7.3416294 30.5600389,6 36.0029169,6 C41.4457948,6 46.4686437,7.3416294 51.0656296,10.0248882 C55.6567817,12.708147 59.3028683,16.3480459 61.9805542,20.9445849 Z M49.5371901,22.4670426 C48.5629558,21.492903 47.3845406,21.0029166 46.0077783,21.0029166 C44.6251823,21.0029166 43.4409334,21.492903 42.4666991,22.4670426 C41.4924648,23.4411822 41.0024307,24.625316 41.0024307,26.0019444 C41.0024307,27.384406 41.4924648,28.5568734 42.4666991,29.5368462 C43.4409334,30.5109858 44.6251823,31.0009722 46.0077783,31.0009722 C47.3845406,31.0009722 48.5629558,30.5109858 49.5371901,29.5368462 C50.5172581,28.5568734 51.0072922,27.384406 51.0072922,26.0019444 C51.0072922,24.625316 50.5172581,23.4411822 49.5371901,22.4670426 Z M46.5010664,51.8039389 C49.6021218,49.5350946 51.7199157,46.5443453 52.8544481,42.8385663 C53.0951065,42.061659 53.0400989,41.3191282 52.6687974,40.5972232 C52.3043718,39.8821934 51.7336676,39.4009234 50.9635607,39.1465379 C50.1934538,38.8990276 49.4439748,38.9677804 48.7082477,39.3321706 C47.9725206,39.6965607 47.4843279,40.28096 47.2367935,41.0853684 C46.4666867,43.5329702 45.0502401,45.5199277 42.9737019,47.0462412 C40.9040397,48.5656793 38.5799672,49.3219608 36.0014844,49.3219608 C33.4230015,49.3219608 31.098929,48.5656793 29.0292668,47.0462412 C26.9527286,45.5199277 25.5362821,43.5329702 24.7661752,41.0853684 C24.5186408,40.28096 24.0304481,39.6965607 23.3153489,39.3321706 C22.5933737,38.9677804 21.8507706,38.8990276 21.0806637,39.1465379 C20.289929,39.4009234 19.7054729,39.8821934 19.3341714,40.5972232 C18.9628698,41.3191282 18.9009863,42.061659 19.1485206,42.8385663 C20.289929,46.5443453 22.4008469,49.5350946 25.5019023,51.8039389 C28.6029576,54.0796585 32.1028183,55.2140806 36.0014844,55.2140806 C39.9001504,55.2140806 43.4000111,54.0796585 46.5010664,51.8039389 Z M30.9975693,26.0019444 C30.9975693,24.625316 30.513369,23.4411822 29.5391347,22.4670426 C28.5590666,21.492903 27.3806514,21.0029166 26.0038892,21.0029166 C24.6212931,21.0029166 23.442878,21.492903 22.4628099,22.4670426 C21.4885756,23.4411822 20.9985416,24.625316 20.9985416,26.0019444 C20.9985416,27.384406 21.4885756,28.5568734 22.4628099,29.5368462 C23.442878,30.5109858 24.6212931,31.0009722 26.0038892,31.0009722 C27.3806514,31.0009722 28.5590666,30.5109858 29.5391347,29.5368462 C30.513369,28.5568734 30.9975693,27.384406 30.9975693,26.0019444 Z"
			/>
		</defs>
		<use xlinkHref="#smiley-positive-a" />
	</svg>
);

const emojiPlugin = createEmojiPlugin({
	theme: emojiPickerCustomClasses,
	useNativeArt: true,
	selectButtonContent: emojiSelectButtonIcon
});
const { EmojiSelect } = emojiPlugin;

const checkboxItem: CheckboxItem = {
	inputId: 'requestFeedback',
	name: 'requestFeedback',
	labelId: 'requestFeedbackLabel',
	label: translate('message.write.peer.checkbox.label'),
	checked: false
};

const INFO_TYPES = {
	ABSENT: 'ABSENT',
	ATTACHMENT_SIZE_ERROR: 'ATTACHMENT_SIZE_ERROR',
	ATTACHMENT_FORMAT_ERROR: 'ATTACHMENT_FORMAT_ERROR',
	ATTACHMENT_OTHER_ERROR: 'ATTACHMENT_OTHER_ERROR'
};

export const getIconForAttachmentType = (attachmentType: string) => {
	if (isJPEGAttachment(attachmentType) || isPNGAttachment(attachmentType)) {
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="72"
				height="72"
				viewBox="0 0 72 72"
			>
				<path d="M66,14 L66,58 C66,59.1045695 65.1045695,60 64,60 L8,60 C6.8954305,60 6,59.1045695 6,58 L6,14 C6,12.8954305 6.8954305,12 8,12 L64,12 C65.1045695,12 66,12.8954305 66,14 Z M50,32 C47.790861,32 46,30.209139 46,28 C46,25.790861 47.790861,24 50,24 C52.209139,24 54,25.790861 54,28 C54,30.209139 52.209139,32 50,32 Z M12,36 L18.4728229,29.5271771 C19.2538715,28.7461285 20.5202014,28.7461285 21.30125,29.5271771 C21.3374451,29.5633722 21.3722372,29.6009434 21.4055497,29.6398079 L30.780538,40.5772943 C31.4664981,41.3775811 32.6558193,41.5081355 33.4990512,40.8757116 L38.6844092,36.9866931 C39.4488529,36.4133603 40.5120805,36.4608724 41.2223387,37.1001048 L60,54 L12,54 L12,36 Z M59,18 L13,18 C12.4477153,18 12,18.4477153 12,19 L12,54 L60,54 L60,19 C60,18.4477153 59.5522847,18 59,18 Z" />
			</svg>
		);
	} else if (isPDFAttachment(attachmentType)) {
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="72"
				height="72"
				viewBox="0 0 72 72"
			>
				<path d="M45.9975237,6 C46.510557,6 47.0039721,6.19715095 47.3757449,6.55068769 L59.3782213,17.9644236 C59.7752431,18.3419709 60,18.8658598 60,19.4137359 L60,64 C60,65.1045695 59.1045695,66 58,66 L14,66 C12.8954305,66 12,65.1045695 12,64 L12,8 C12,6.8954305 12.8954305,6 14,6 L45.9975237,6 Z M27.2958984,43.8876953 C26.2932893,43.8876953 25.501956,44.3137978 24.921875,45.1660156 L24.921875,45.1660156 L24.8144531,44.1025391 L22,44.1025391 L22,60.1943359 L25.0400391,60.1943359 L25.0400391,54.7910156 C25.6129586,55.5572955 26.3720656,55.9404297 27.3173828,55.9404297 C28.5563213,55.9404297 29.4890919,55.4534554 30.1157227,54.4794922 C30.7423534,53.505529 31.0556641,52.1054779 31.0556641,50.2792969 L31.0556641,50.2792969 L31.0556641,49.3876953 C31.0413411,47.5257068 30.720869,46.1435592 30.0942383,45.2412109 C29.4676075,44.3388627 28.5348369,43.8876953 27.2958984,43.8876953 Z M41.5615234,39.2255859 L38.5,39.2255859 L38.5,45.0478516 C37.905596,44.2744102 37.1608118,43.8876953 36.265625,43.8876953 C35.033848,43.8876953 34.0957063,44.3567661 33.4511719,45.2949219 C32.8066374,46.2330776 32.484375,47.6546129 32.484375,49.5595703 L32.484375,49.5595703 L32.484375,50.4404297 C32.498698,52.2451262 32.8263314,53.6129511 33.4672852,54.5439453 C34.1082389,55.4749396 35.0374288,55.9404297 36.2548828,55.9404297 C37.2360075,55.9404297 38.0380828,55.4749396 38.6611328,54.5439453 L38.6611328,54.5439453 L38.8007812,55.7255859 L41.5615234,55.7255859 L41.5615234,39.2255859 Z M48.2861328,39 C47.1044863,39 46.178877,39.356279 45.5092773,40.0688477 C44.8396776,40.7814163 44.5013021,41.7786394 44.4941406,43.0605469 L44.4941406,43.0605469 L44.4941406,44.1025391 L43.0869141,44.1025391 L43.0869141,46.390625 L44.4941406,46.390625 L44.4941406,55.7255859 L47.5449219,55.7255859 L47.5449219,46.390625 L49.3603516,46.390625 L49.3603516,44.1025391 L47.5449219,44.1025391 L47.5449219,43.1572266 C47.5449219,42.0830024 47.9960892,41.5458984 48.8984375,41.5458984 C49.1848973,41.5458984 49.4319651,41.5781247 49.6396484,41.6425781 L49.6396484,41.6425781 L49.6611328,39.2148438 C49.1025363,39.0716139 48.6442075,39 48.2861328,39 Z M26.4042969,46.4335938 C26.9915394,46.4335938 27.4086902,46.6663388 27.6557617,47.1318359 C27.9028333,47.5973331 28.0263672,48.392247 28.0263672,49.5166016 L28.0263672,49.5166016 L28.0263672,50.2792969 C28.0263672,51.353521 27.9099947,52.1448542 27.6772461,52.6533203 C27.4444975,53.1617864 27.0273468,53.4160156 26.4257812,53.4160156 C25.7740853,53.4160156 25.3121758,53.1653671 25.0400391,52.6640625 L25.0400391,52.6640625 L25.0400391,47.2177734 C25.3264988,46.6949844 25.7812469,46.4335938 26.4042969,46.4335938 Z M37.1464844,46.4335938 C37.7480499,46.4335938 38.1992172,46.7200492 38.5,47.2929688 L38.5,47.2929688 L38.5,52.5996094 C38.1920558,53.1367214 37.7373077,53.4052734 37.1357422,53.4052734 C36.5556612,53.4052734 36.1438814,53.1778994 35.9003906,52.7231445 C35.6568998,52.2683897 35.5351562,51.4681047 35.5351562,50.3222656 L35.5351562,50.3222656 L35.5351562,49.5166016 C35.5351562,48.363601 35.6640612,47.5615257 35.921875,47.1103516 C36.1796888,46.6591774 36.5878878,46.4335938 37.1464844,46.4335938 Z M42.7966518,12 L19,12 C18.4477153,12 18,12.4477153 18,13 L18,33 L54,33 L54,22.5557031 C54,22.0034184 53.5522847,21.5557031 53,21.5557031 L44.7966518,21.5557031 C44.244367,21.5557031 43.7966518,21.1079879 43.7966518,20.5557031 L43.7966518,13 C43.7966518,12.4477153 43.3489365,12 42.7966518,12 Z" />
			</svg>
		);
	} else if (isDOCXAttachment(attachmentType)) {
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="72"
				height="72"
				viewBox="0 0 72 72"
			>
				<path d="M45.9975237,6 C46.510557,6 47.0039721,6.19715095 47.3757449,6.55068769 L59.3782213,17.9644236 C59.7752431,18.3419709 60,18.8658598 60,19.4137359 L60,64 C60,65.1045695 59.1045695,66 58,66 L14,66 C12.8954305,66 12,65.1045695 12,64 L12,8 C12,6.8954305 12.8954305,6 14,6 L45.9975237,6 Z M30.0771484,40 L27.015625,40 L27.015625,45.8222656 C26.421221,45.0488243 25.6764368,44.6621094 24.78125,44.6621094 C23.549473,44.6621094 22.6113313,45.1311802 21.9667969,46.0693359 C21.3222624,47.0074917 21,48.4290269 21,50.3339844 L21,50.3339844 L21,51.2148438 C21.014323,53.0195403 21.3419564,54.3873651 21.9829102,55.3183594 C22.6238639,56.2493536 23.5530538,56.7148438 24.7705078,56.7148438 C25.7516325,56.7148438 26.5537078,56.2493536 27.1767578,55.3183594 L27.1767578,55.3183594 L27.3164062,56.5 L30.0771484,56.5 L30.0771484,40 Z M36.6513672,44.6621094 C35.1832609,44.6621094 34.0338583,45.1634064 33.203125,46.1660156 C32.3723917,47.1686248 31.9570312,48.5507724 31.9570312,50.3125 L31.9570312,50.3125 L31.9570312,51.0537109 C31.9570312,52.8297615 32.3706013,54.2172802 33.1977539,55.2163086 C34.0249065,56.215337 35.1832608,56.7148438 36.6728516,56.7148438 C38.1552808,56.7148438 39.3082641,56.2171274 40.1318359,55.2216797 C40.9554078,54.226232 41.3671875,52.8440844 41.3671875,51.0751953 L41.3671875,51.0751953 L41.3671875,50.3339844 C41.3671875,48.5579338 40.9518271,47.1686248 40.1210938,46.1660156 C39.2903604,45.1634064 38.1337965,44.6621094 36.6513672,44.6621094 Z M47.5009766,44.6621094 C45.9827398,44.6621094 44.8351276,45.1419223 44.0581055,46.1015625 C43.2810834,47.0612027 42.8925781,48.4540924 42.8925781,50.2802734 L42.8925781,50.2802734 L42.8925781,51.2041016 C42.9069011,53.0159596 43.3079388,54.3873651 44.0957031,55.3183594 C44.8834675,56.2493536 46.0257087,56.7148438 47.5224609,56.7148438 C48.7327534,56.7148438 49.7210248,56.3245482 50.4873047,55.5439453 C51.2535846,54.7633425 51.6438801,53.7392642 51.6582031,52.4716797 L51.6582031,52.4716797 L48.8007812,52.4716797 C48.7864583,53.6175188 48.3388716,54.1904297 47.4580078,54.1904297 C47.0641256,54.1904297 46.7597667,54.1027027 46.5449219,53.9272461 C46.3300771,53.7517895 46.1761072,53.4760761 46.0830078,53.1000977 C45.9899084,52.7241192 45.9433594,52.0634813 45.9433594,51.1181641 L45.9433594,51.1181641 L45.9433594,49.9365234 C45.9576824,48.8551378 46.0794259,48.1264667 46.3085938,47.7504883 C46.5377616,47.3745098 46.9173151,47.1865234 47.4472656,47.1865234 C47.9270857,47.1865234 48.2708323,47.3619774 48.4785156,47.7128906 C48.686199,48.0638038 48.7936198,48.5651009 48.8007812,49.2167969 L48.8007812,49.2167969 L51.6582031,49.2167969 C51.6438801,47.7630136 51.2679073,46.6404662 50.5302734,45.8491211 C49.7926395,45.057776 48.782884,44.6621094 47.5009766,44.6621094 Z M36.6513672,47.1865234 C37.1884792,47.1865234 37.6038397,47.442543 37.8974609,47.9545898 C38.1910822,48.4666367 38.3378906,49.2525989 38.3378906,50.3125 L38.3378906,50.3125 L38.3271484,51.5908203 C38.248372,53.3239019 37.6969452,54.1904297 36.6728516,54.1904297 C35.56282,54.1904297 35.0078125,53.1520286 35.0078125,51.0751953 L35.0078125,51.0751953 L35.0078125,50.3125 C35.0078125,49.2525989 35.1528306,48.4666367 35.4428711,47.9545898 C35.7329116,47.442543 36.1357396,47.1865234 36.6513672,47.1865234 Z M25.6621094,47.2080078 C26.2636749,47.2080078 26.7148422,47.4944633 27.015625,48.0673828 L27.015625,48.0673828 L27.015625,53.3740234 C26.7076808,53.9111355 26.2529327,54.1796875 25.6513672,54.1796875 C25.0712862,54.1796875 24.6595064,53.9523135 24.4160156,53.4975586 C24.1725248,53.0428037 24.0507812,52.2425188 24.0507812,51.0966797 L24.0507812,51.0966797 L24.0507812,50.2910156 C24.0507812,49.1380151 24.1796862,48.3359398 24.4375,47.8847656 C24.6953138,47.4335915 25.1035128,47.2080078 25.6621094,47.2080078 Z M42.7966518,12 L19,12 C18.4477153,12 18,12.4477153 18,13 L18,33 L54,33 L54,22.5557031 C54,22.0034184 53.5522847,21.5557031 53,21.5557031 L44.7966518,21.5557031 C44.244367,21.5557031 43.7966518,21.1079879 43.7966518,20.5557031 L43.7966518,13 C43.7966518,12.4477153 43.3489365,12 42.7966518,12 Z" />
			</svg>
		);
	} else if (isXLSXAttachment(attachmentType)) {
		return (
			<svg
				width="72px"
				height="72px"
				viewBox="0 0 72 72"
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
			>
				<g
					id="icon/file-xls"
					stroke="none"
					strokeWidth="1"
					fill="none"
					fillRule="evenodd"
				>
					<path
						d="M45.9975237,6 C46.510557,6 47.0039721,6.19715095 47.3757449,6.55068769 L59.3782213,17.9644236 C59.7752431,18.3419709 60,18.8658598 60,19.4137359 L60,64 C60,65.1045695 59.1045695,66 58,66 L14,66 C12.8954305,66 12,65.1045695 12,64 L12,8 C12,6.8954305 12.8954305,6 14,6 L45.9975237,6 Z M44.288,43.856 C43.5106628,43.856 42.8470028,43.9513324 42.297,44.142 C41.7469972,44.3326676 41.2960018,44.5893317 40.944,44.912 C40.5919982,45.2346683 40.3353341,45.6123312 40.174,46.045 C40.0126659,46.4776688 39.932,46.9359976 39.932,47.42 C39.932,48.2560042 40.1446645,48.941664 40.57,49.477 C40.9953355,50.012336 41.6259958,50.4266652 42.462,50.72 L42.462,50.72 L44.596,51.49 C44.8893348,51.6073339 45.1459989,51.764999 45.366,51.963 C45.5860011,52.161001 45.696,52.4506648 45.696,52.832 C45.696,53.3013357 45.5566681,53.6533322 45.278,53.888 C44.9993319,54.1226678 44.6253357,54.24 44.156,54.24 C43.6426641,54.24 43.2503347,54.0823349 42.979,53.767 C42.7076653,53.4516651 42.572,53.0373359 42.572,52.524 L42.572,52.524 L42.572,52.128 L39.844,52.128 L39.844,52.546 C39.844,53.1180029 39.9099993,53.6349977 40.042,54.097 C40.1740007,54.5590023 40.4049983,54.9513317 40.735,55.274 C41.0650016,55.5966683 41.5123305,55.8386659 42.077,56 C42.6416695,56.1613341 43.3493291,56.242 44.2,56.242 C44.8453366,56.242 45.435664,56.1760007 45.971,56.044 C46.506336,55.9119993 46.9683314,55.6920015 47.357,55.384 C47.7456686,55.0759985 48.0499989,54.6910023 48.27,54.229 C48.4900011,53.7669977 48.6,53.2206698 48.6,52.59 C48.6,51.6953289 48.402002,50.9876693 48.006,50.467 C47.609998,49.9463307 46.9353381,49.5246683 45.982,49.202 L45.982,49.202 L43.9712337,48.5237811 C43.5581597,48.3745934 43.2714175,48.1973344 43.111,47.992 C42.9276658,47.7573322 42.836,47.4933348 42.836,47.2 C42.836,46.7746645 42.9789986,46.4556677 43.265,46.243 C43.5510014,46.0303323 43.8846648,45.924 44.266,45.924 C44.7646692,45.924 45.112999,46.0669986 45.311,46.353 C45.509001,46.6390014 45.608,47.0899969 45.608,47.706 L45.608,47.706 L48.336,47.706 L48.336,47.222 C48.336,46.151328 48.0060033,45.3226696 47.346,44.736 C46.6859967,44.1493304 45.6666736,43.856 44.288,43.856 Z M27.348,44.164 L24.18,44.164 L27.26,49.906 L24.048,56 L27.216,56 L28.976,52.128 L30.736,56 L33.904,56 L30.692,49.906 L33.772,44.164 L30.604,44.164 L28.976,47.728 L27.348,44.164 Z M38.216,40.292 L35.18,40.292 L35.18,56 L38.216,56 L38.216,40.292 Z M42.7966518,12 L19,12 C18.4477153,12 18,12.4477153 18,13 L18,33 L54,33 L54,22.5557031 C54,22.0034184 53.5522847,21.5557031 53,21.5557031 L44.7966518,21.5557031 C44.244367,21.5557031 43.7966518,21.1079879 43.7966518,20.5557031 L43.7966518,13 C43.7966518,12.4477153 43.3489365,12 42.7966518,12 Z"
						id="file-xls"
						fill="#000000"
						fillRule="nonzero"
					></path>
				</g>
			</svg>
		);
	}
};

export interface MessageSubmitItem {
	formId: string;
	wrapperClass: string;
	textareaId: string;
	textareaName: string;
	textareaClass: string;
	svgId: string;
	svgClass: string;
	placeholder: string;
	sessionRoomId: string;
}

export interface MessageSubmitInterfaceComponentProps
	extends MessageSubmitItem {
	type: string;
	handleSendButton: Function;
	showMonitoringButton?: Function;
	isTyping?: Function;
	typingUsers?: [];
}

export const MessageSubmitInterfaceComponent = (
	props: MessageSubmitInterfaceComponentProps
) => {
	let textareaRef: React.RefObject<HTMLDivElement> = React.useRef();
	let featureWrapperRef: React.RefObject<HTMLSpanElement> = React.useRef();
	let attachmentInputRef: React.RefObject<HTMLInputElement> = React.useRef();
	const { userData } = useContext(UserDataContext);
	const [placeholder, setPlaceholder] = useState(props.placeholder);
	const { sessionsData } = useContext(SessionsDataContext);
	const { activeSessionGroupId } = useContext(ActiveSessionGroupIdContext);
	const activeSession = getActiveSession(activeSessionGroupId, sessionsData);
	const isGroupChat = isGroupChatForSessionItem(activeSession);
	const [activeInfo, setActiveInfo] = useState(null);
	const [attachmentSelected, setAttachmentSelected] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(null);
	const [uploadOnLoadHandling, setUploadOnLoadHandling] = useState(null);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const [attachmentUpload, setAttachmentUpload] = useState(null);
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [isRichtextActive, setIsRichtextActive] = useState(false);

	const requestFeedbackCheckbox = document.getElementById(
		'requestFeedback'
	) as HTMLInputElement;

	const isConsultantAbsent =
		hasUserAuthority(AUTHORITIES.USER_DEFAULT, userData) &&
		activeSession?.consultant?.absent;

	useEffect(() => {
		isConsultantAbsent ? setActiveInfo(INFO_TYPES.ABSENT) : null;
	}, []);

	useEffect(() => {
		!activeInfo && isConsultantAbsent
			? setActiveInfo(INFO_TYPES.ABSENT)
			: null;
	}, [activeInfo]);

	useEffect(() => {
		resizeTextarea();
		const toolbar: HTMLDivElement = document.querySelector(
			'.textarea__toolbar'
		);
		const richtextToggle: HTMLSpanElement = document.querySelector(
			'.textarea__richtextToggle'
		);
		if (isRichtextActive) {
			toolbar.classList.add('textarea__toolbar--active');
			richtextToggle.classList.add('textarea__richtextToggle--active');
		} else {
			toolbar.classList.remove('textarea__toolbar--active');
			richtextToggle.classList.remove('textarea__richtextToggle--active');
		}
	}, [isRichtextActive]);

	useEffect(() => {
		resizeTextarea();
		if (!attachmentSelected && uploadProgress) {
			removeSelectedAttachment();
		}
	}, [attachmentSelected]);

	useEffect(() => {
		const uploadProgressBar = document.querySelector(
			'.textarea__attachmentSelected__progress'
		);
		if (uploadProgressBar && uploadProgress > 0 && uploadProgress <= 100) {
			uploadProgressBar.setAttribute(
				'style',
				`width: ${uploadProgress}%`
			);
		}
	}, [uploadProgress]);

	useEffect(() => {
		if (uploadOnLoadHandling) {
			removeSelectedAttachment();
			if (uploadOnLoadHandling.status === 201) {
				handleMessageSendSuccess();
				cleanupAttachment();
			} else if (uploadOnLoadHandling.status === 413) {
				handleAttachmentUploadError(INFO_TYPES.ATTACHMENT_SIZE_ERROR);
			} else if (uploadOnLoadHandling.status === 415) {
				handleAttachmentUploadError(INFO_TYPES.ATTACHMENT_FORMAT_ERROR);
			} else {
				handleAttachmentUploadError(INFO_TYPES.ATTACHMENT_OTHER_ERROR);
			}
		}
	}, [uploadOnLoadHandling]);

	const handleAttachmentUploadError = (infoType: string) => {
		setActiveInfo(infoType);
		cleanupAttachment();
		setTimeout(() => setIsRequestInProgress(false), 1200);
	};

	const handleEditorChange = (editorState) => {
		isGroupChat ? props.isTyping() : null;
		setEditorState(editorState);
	};

	const handleEditorKeyCommand = (command) => {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			handleEditorChange(newState);
			return 'handled';
		}
		return 'not-handled';
	};

	const resizeTextarea = () => {
		const textarea: any = textareaRef.current;
		const featureWrapper: any = featureWrapperRef.current;
		const richtextEditor: HTMLDivElement = document.querySelector(
			'.DraftEditor-root'
		);

		resetTextareaSize(textarea);

		let maxHeight;
		if (window.innerWidth <= 900) {
			maxHeight = 118;
		} else {
			maxHeight = 218;
		}

		const fileHeight = 44;
		const richtextHeight = 37;

		let textHeight = textarea.scrollHeight;
		textHeight = attachmentSelected ? textHeight + fileHeight : textHeight;
		textHeight = isRichtextActive
			? textHeight + richtextHeight
			: textHeight;

		if (textHeight <= maxHeight) {
			textarea.setAttribute(
				'style',
				'min-height: ' + textHeight + 'px;' + ' overflow-y: hidden;'
			);
			attachmentSelected
				? textarea.setAttribute(
						'style',
						'min-height: ' +
							textHeight +
							'px; padding-bottom: ' +
							fileHeight +
							'px; overflow-y: hidden;'
				  )
				: textarea.setAttribute(
						'style',
						'min-height: ' +
							textHeight +
							'px;' +
							' overflow-y: hidden;'
				  );
			featureWrapper.setAttribute(
				'style',
				'min-height: ' + textHeight + 'px;'
			);
		} else {
			textarea.setAttribute(
				'style',
				'min-height: ' + maxHeight + 'px;' + ' overflow-y: scroll;'
			);
			attachmentSelected
				? textarea.setAttribute(
						'style',
						'min-height: ' +
							maxHeight +
							'px; padding-bottom: ' +
							fileHeight +
							'px; overflow-y: scroll;'
				  )
				: textarea.setAttribute(
						'style',
						'min-height: ' +
							maxHeight +
							'px;' +
							' overflow-y: scroll;'
				  );
			featureWrapper.setAttribute(
				'style',
				'min-height: ' + maxHeight + 'px;'
			);
		}
		attachmentSelected
			? (richtextEditor.style.paddingBottom = fileHeight + 'px')
			: (richtextEditor.style.paddingBottom = '14px');
	};

	const resetTextareaSize = (textarea) => {
		const featureWrapper: any = featureWrapperRef.current;

		if (window.innerWidth <= 900) {
			textarea.setAttribute('style', 'min-height: 87px;');
			featureWrapper.setAttribute('style', 'min-height: 87px;');
		} else {
			textarea.setAttribute('style', 'min-height: 106px;');
			featureWrapper.setAttribute('style', 'min-height: 106px;');
		}
	};

	const toggleAbsentMessage = () => {
		//TODO: not react way: use state and based on that set a class
		const infoWrapper = document.querySelector('.messageSubmitInfoWrapper');
		if (infoWrapper) {
			infoWrapper.classList.toggle('messageSubmitInfoWrapper--hidden');
		}
	};

	const handleTextareaClick = () => {
		this.editor.focus();
	};

	const getTypedMarkdownMessage = () => {
		const contentState = editorState.getCurrentContent();
		const rawObject = convertToRaw(contentState);
		const markdownString = draftToMarkdown(rawObject);
		return markdownString.trim();
	};

	const handleButtonClick = (event) => {
		if (uploadProgress || isRequestInProgress) {
			return null;
		}

		const attachmentInput: any = attachmentInputRef.current;
		const attachment = attachmentInput.files[0];
		if (getTypedMarkdownMessage() || attachment) {
			setIsRequestInProgress(true);
		} else {
			return null;
		}

		if (
			typeIsEnquiry(props.type) &&
			hasUserAuthority(AUTHORITIES.USER_DEFAULT, userData)
		) {
			ajaxSendEnquiry(getTypedMarkdownMessage())
				.then((response) => {
					setEditorState(EditorState.createEmpty());
					props.handleSendButton();
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			const sendToFeedbackEndpoint =
				activeSession.isFeedbackSession ||
				requestFeedbackCheckbox?.checked;
			const sendToRoomWithId = requestFeedbackCheckbox?.checked
				? activeSession.session.feedbackGroupId
				: props.sessionRoomId;

			const getSendMailNotificationStatus = () => !isGroupChat;

			if (attachment) {
				setAttachmentUpload(
					ajaxCallUploadAttachment(
						getTypedMarkdownMessage(),
						attachment,
						sendToRoomWithId,
						sendToFeedbackEndpoint,
						getSendMailNotificationStatus(),
						setUploadProgress,
						setUploadOnLoadHandling
					)
				);
			} else {
				if (getTypedMarkdownMessage()) {
					ajaxSendMessage(
						getTypedMarkdownMessage(),
						sendToRoomWithId,
						sendToFeedbackEndpoint,
						getSendMailNotificationStatus()
					)
						.then(() => {
							handleMessageSendSuccess();
						})
						.catch((error) => {
							console.log(error);
						});
				}
			}
		}
	};

	const handleMessageSendSuccess = () => {
		props.showMonitoringButton();
		if (requestFeedbackCheckbox?.checked) {
			const feedbackButton = document.querySelector(
				'.sessionInfo__feedbackButton'
			);
			feedbackButton.classList.add('sessionInfo__feedbackButton--active');
			setTimeout(() => {
				feedbackButton.classList.remove(
					'sessionInfo__feedbackButton--active'
				);
			}, 700);
		}
		setEditorState(EditorState.createEmpty());
		setActiveInfo(null);
		setTimeout(() => setIsRequestInProgress(false), 1200);
	};

	const handleCheckboxClick = () => {
		const textarea = document.querySelector('.textarea');
		textarea.classList.toggle('textarea--yellowTheme');
		placeholder === translate('enquiry.write.input.placeholder.consultant')
			? setPlaceholder(
					translate('enquiry.write.input.placeholder.feedback.peer')
			  )
			: setPlaceholder(
					translate('enquiry.write.input.placeholder.consultant')
			  );
	};

	const handleAttachmentSelect = () => {
		const attachmentInput: any = attachmentInputRef.current;
		attachmentInput.click();
	};

	const handleAttachmentChange = () => {
		const attachmentInput: any = attachmentInputRef.current;
		const attachment = attachmentInput.files[0];
		const attachmentSizeMB = getAttachmentSizeMBForKB(attachment.size);
		attachmentSizeMB > ATTACHMENT_MAX_SIZE_IN_MB
			? handleLargeAttachments()
			: displayAttachmentToUpload(attachment);
	};

	const displayAttachmentToUpload = (attachment: File) => {
		setAttachmentSelected(attachment);
		setActiveInfo(null);
	};

	const handleLargeAttachments = () => {
		removeSelectedAttachment();
		setActiveInfo(INFO_TYPES.ATTACHMENT_SIZE_ERROR);
	};

	const removeSelectedAttachment = () => {
		const attachmentInput: any = attachmentInputRef.current;
		if (attachmentInput) {
			attachmentInput.value = '';
		}
	};

	const handleAttachmentRemoval = () => {
		if (uploadProgress && attachmentUpload) {
			attachmentUpload.abort();
		}
		setActiveInfo(null);
		cleanupAttachment();
	};

	const cleanupAttachment = () => {
		setUploadProgress(null);
		setAttachmentSelected(null);
		setAttachmentUpload(null);
		setUploadOnLoadHandling(false);
		removeSelectedAttachment();
	};

	const getMessageSubmitInfo = (): MessageSubmitInfoInterface => {
		let infoData;
		if (activeInfo === INFO_TYPES.ABSENT) {
			infoData = {
				isInfo: true,
				infoHeadline:
					translate('consultant.absent.message') +
					getContact(activeSession).username,
				infoMessage: activeSession.consultant.absenceMessage
			};
		} else if (activeInfo === INFO_TYPES.ATTACHMENT_SIZE_ERROR) {
			infoData = {
				isInfo: false,
				infoHeadline: translate('attachments.error.size.headline'),
				infoMessage: translate('attachments.error.size.message')
			};
		} else if (activeInfo === INFO_TYPES.ATTACHMENT_FORMAT_ERROR) {
			infoData = {
				isInfo: false,
				infoHeadline: translate('attachments.error.format.headline'),
				infoMessage: translate('attachments.error.format.message')
			};
		} else if (activeInfo === INFO_TYPES.ATTACHMENT_OTHER_ERROR) {
			infoData = {
				isInfo: false,
				infoHeadline: translate('attachments.error.other.headline'),
				infoMessage: translate('attachments.error.other.message')
			};
		}
		return infoData;
	};

	const hasUploadFunctionality =
		!typeIsEnquiry(props.type) ||
		(typeIsEnquiry(props.type) &&
			!hasUserAuthority(AUTHORITIES.USER_DEFAULT, userData));
	const hasRequestFeedbackCheckbox =
		hasUserAuthority(AUTHORITIES.USE_FEEDBACK, userData) &&
		!hasUserAuthority(AUTHORITIES.VIEW_ALL_PEER_SESSIONS, userData) &&
		activeSession.session.feedbackGroupId &&
		!activeSession.isFeedbackSession;
	return (
		<div
			className={
				isGroupChat
					? 'messageSubmit__wrapper messageSubmit__wrapper--withTyping'
					: 'messageSubmit__wrapper'
			}
		>
			{isGroupChat ? (
				<TypingIndicator
					disabled={
						!(props.typingUsers && props.typingUsers.length > 0)
					}
					typingUsers={props.typingUsers}
				/>
			) : null}
			{activeInfo ? (
				<MessageSubmitInfo {...getMessageSubmitInfo()} />
			) : null}
			<form
				id={props.formId}
				className={
					hasRequestFeedbackCheckbox
						? 'textarea textarea--large'
						: 'textarea'
				}
			>
				<span className="textarea__outerWrapper">
					{hasRequestFeedbackCheckbox ? (
						<Checkbox
							className="textarea__checkbox"
							item={checkboxItem}
							checkboxHandle={handleCheckboxClick}
						/>
					) : null}
					<div className={props.wrapperClass + ` textarea__wrapper`}>
						<span
							ref={featureWrapperRef}
							className="textarea__featureWrapper"
						>
							<span
								className="textarea__richtextToggle"
								onClick={() =>
									setIsRichtextActive(!isRichtextActive)
								}
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 40 40"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M0 4.10527V2C0 0.895431 0.895432 0 2 0H25.3684C26.473 0 27.3684 0.895428 27.3684 2V4.10526C27.3684 5.20983 26.473 6.10526 25.3684 6.10526H16.8421V21.0596C16.8421 21.4002 16.7551 21.7351 16.5895 22.0327L12.007 30.2617C11.916 30.4251 11.7438 30.5263 11.5568 30.5263C10.9877 30.5263 10.5263 30.0649 10.5263 29.4958V6.10526H2C0.895431 6.10526 0 5.20984 0 4.10527Z"
										fill="black"
									/>
									<path
										d="M27.4711 27.5444C27.1679 27.8731 26.677 27.9334 26.2889 27.7112L21.2284 24.8139C20.8359 24.5892 20.6399 24.1282 20.7778 23.6976C21.2865 22.1088 22.1072 20.4495 23.2396 18.7229C24.9256 16.1469 27.9416 11.7481 32.2858 5.52718C33.254 4.1402 35.1717 3.79366 36.5691 4.75314C37.8073 5.60327 38.2429 7.21781 37.5986 8.5689C34.3339 15.4219 32.0021 20.2109 30.5993 22.9352C29.6538 24.7722 28.611 26.3086 27.4711 27.5444ZM18.9262 27.4276L25.152 30.9907L23.734 34.7247L15.7895 40L16.3738 30.5107L18.9262 27.4276Z"
										fill="black"
									/>
								</svg>
							</span>
							<EmojiSelect />
						</span>
						<span className="textarea__inputWrapper">
							<div
								className={`textarea__input ${
									props.textareaClass
								} ${
									isRichtextActive
										? 'textarea__input--activeRichtext'
										: ''
								}`}
								ref={textareaRef}
								onKeyUp={resizeTextarea}
								onFocus={toggleAbsentMessage}
								onBlur={toggleAbsentMessage}
								onClick={handleTextareaClick}
								id={props.textareaId}
							>
								<PluginsEditor
									editorState={editorState}
									onChange={handleEditorChange}
									handleKeyCommand={handleEditorKeyCommand}
									placeholder={placeholder}
									handleBeforeInput={() =>
										handleEditorBeforeInput(editorState)
									}
									handlePastedText={(pastedText) =>
										handleEditorPastedText(
											editorState,
											pastedText
										)
									}
									ref={(element) => {
										this.editor = element;
									}}
									plugins={[
										linkifyPlugin,
										staticToolbarPlugin,
										emojiPlugin
									]}
								/>
								<Toolbar>
									{(externalProps) => (
										<div className="textarea__toolbar__buttonWrapper">
											<BoldButton {...externalProps} />
											<ItalicButton {...externalProps} />
											<UnorderedListButton
												{...externalProps}
											/>
										</div>
									)}
								</Toolbar>
							</div>
							{hasUploadFunctionality ? (
								!attachmentSelected ? (
									<span className="textarea__attachmentSelect">
										<svg
											onClick={handleAttachmentSelect}
											xmlns="http://www.w3.org/2000/svg"
											width="72"
											height="72"
											viewBox="0 0 72 72"
										>
											<path d="M61.4503861,32.0990678 L32.1454226,61.4040313 C29.1360476,64.3122561 22.4887695,66.1835938 17.904541,61.4040313 C13.3203125,56.6244689 15.6286062,51.1576276 17.904541,48.3122559 C18.0568749,47.6180868 39.9625916,25.8088649 39.9625916,25.8088649 C41.4756502,24.2958064 43.9413041,24.3083472 45.4699209,25.836964 C46.9984495,27.3654926 47.0109903,29.8311465 45.4979318,31.3442051 L23.581011,53.2611258 C21.3112487,55.5308882 24.1298315,58.349471 26.3995939,56.0797087 L56.7725553,25.7067473 C58.7169912,23.3331455 57.3345717,18.5242218 55.1223575,16.3120076 C52.8296527,14.0193028 47.7472261,12.6164587 45.4775511,14.8861337 C45.4775511,14.8861337 13.9721083,46.3915764 12.8129229,47.5507618 C11.6538248,48.70986 8.6235456,49.2621208 7.0949288,47.733504 C5.56631199,46.2048872 5.64837097,43.6448098 7.27767094,42.0155098 C29.1301671,20.1244581 40.1228367,9.13178851 40.2556797,9.0375011 C45.5736761,4.05469134 55.3577947,5.58898439 60.6015877,10.8327774 C64.9553994,15.1865891 69.017334,25.7067473 61.4503861,32.0990678 Z" />
										</svg>
									</span>
								) : (
									<span className="textarea__attachmentSelected">
										<span className="textarea__attachmentSelected__progress"></span>
										<span className="textarea__attachmentSelected__labelWrapper">
											{getIconForAttachmentType(
												attachmentSelected.type
											)}
											<p className="textarea__attachmentSelected__label">
												{attachmentSelected.name}
											</p>
											<span className="textarea__attachmentSelected__remove">
												<svg
													onClick={
														handleAttachmentRemoval
													}
													xmlns="http://www.w3.org/2000/svg"
													xmlnsXlink="http://www.w3.org/1999/xlink"
													width="72"
													height="72"
													viewBox="0 0 72 72"
												>
													<defs>
														<path
															id="x-a"
															d="M45.6482323,36.5771645 L65.5685425,56.4974747 C66.3495911,57.2785233 66.3495911,58.5448532 65.5685425,59.3259018 L59.3259018,65.5685425 C58.5448532,66.3495911 57.2785233,66.3495911 56.4974747,65.5685425 L36.5771645,45.6482323 L16.6568542,65.5685425 C15.8758057,66.3495911 14.6094757,66.3495911 13.8284271,65.5685425 L7.58578644,59.3259018 C6.80473785,58.5448532 6.80473785,57.2785233 7.58578644,56.4974747 L27.5060967,36.5771645 L7.58578644,16.6568542 C6.80473785,15.8758057 6.80473785,14.6094757 7.58578644,13.8284271 L13.8284271,7.58578644 C14.6094757,6.80473785 15.8758057,6.80473785 16.6568542,7.58578644 L36.5771645,27.5060967 L56.4974747,7.58578644 C57.2785233,6.80473785 58.5448532,6.80473785 59.3259018,7.58578644 L65.5685425,13.8284271 C66.3495911,14.6094757 66.3495911,15.8758057 65.5685425,16.6568542 L45.6482323,36.5771645 Z"
														/>
													</defs>
													<use xlinkHref="#x-a" />
												</svg>
											</span>
										</span>
									</span>
								)
							) : null}
						</span>
						<SendMessageButton
							handleSendButton={(event) =>
								handleButtonClick(event)
							}
							type={props.type}
							sessionRoomId={props.sessionRoomId}
							svgClass={props.svgClass}
							svgId={props.svgId}
							clicked={isRequestInProgress}
							deactivated={uploadProgress}
						/>
					</div>
				</span>
				{hasUploadFunctionality ? (
					<span>
						<input
							ref={attachmentInputRef}
							onChange={handleAttachmentChange}
							className="textarea__attachmentInput"
							type="file"
							id="dataUpload"
							name="dataUpload"
							accept="image/jpeg, image/png, .pdf, .docx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
						/>
					</span>
				) : null}
			</form>
		</div>
	);
};
