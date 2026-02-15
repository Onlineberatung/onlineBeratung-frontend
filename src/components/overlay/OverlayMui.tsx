import * as React from 'react';
import { v4 as uuid } from 'uuid';
import { useContext, useEffect, useState, VFC } from 'react';
import { createPortal } from 'react-dom';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ButtonItem, Button } from '../button/Button';
import { Text } from '../text/Text';
import { Headline, HeadlineLevel } from '../headline/Headline';
import clsx from 'clsx';
import './overlayMui.styles.scss';
import { useTranslation } from 'react-i18next';
import { ModalContext } from '../../globalState';
import { OVERLAY_TYPES } from '../../globalState/interfaces/AppConfig/OverlaysConfigInterface';
import { LoadingIndicator } from '../loadingIndicator/LoadingIndicator';

export const OVERLAY_FUNCTIONS = {
CLOSE: 'CLOSE',
CLOSE_SUCCESS: 'CLOSE_SUCCESS',
REDIRECT: 'REDIRECT',
REDIRECT_WITH_BLUR: 'REDIRECT_WITH_BLUR',
REDIRECT_TO_URL: 'REDIRECT_TO_URL',
LOGOUT: 'LOGOUT',
DEACTIVATE_ABSENCE: 'DEACTIVATE_ABSENCE',
COPY_LINK: 'COPY_LINK',
STOP_GROUP_CHAT: 'STOP_GROUP_CHAT',
LEAVE_GROUP_CHAT: 'LEAVE_GROUP_CHAT',
DELETE_ACCOUNT: 'DELETE_ACCOUNT',
DELETE_EMAIL: 'DELETE_EMAIL',
NEXT_STEP: 'NEXT_STEP',
PREV_STEP: 'PREV_STEP',
DELETE_SESSION: 'DELETE_SESSION',
FINISH_ANONYMOUS_CONVERSATION: 'FINISH_ANONYMOUS_CONVERSATION',
ARCHIVE: 'ARCHIVE',
CONFIRM_EDIT: 'CONFIRM_EDIT',
ASSIGN: 'ASSIGN',
REASSIGN: 'REASSIGN'
};

export const OVERLAY_RESET_TIME = 10000;

export interface OverlayItem {
buttonSet?: ButtonItem[];
copy?: string;
headline?: string;
headlineStyleLevel?: HeadlineLevel;
illustrationBackground?: 'error' | 'neutral' | 'info' | 'large';
illustrationStyle?: 'small' | 'large';
nestedComponent?: React.ReactNode;
svg?: React.FunctionComponent<
React.SVGProps<SVGSVGElement> & { title?: string }
>;
handleNextStep?: (callback: Function) => void;
handleOverlay?: Function;
showCloseButton?: boolean;
step?: {
icon: React.FunctionComponent<
React.SVGProps<SVGSVGElement> & { title?: string }
>;
label: string;
};
}

type OverlayProps = {
className?: string;
item?: OverlayItem;
handleOverlay?: Function;
handleOverlayClose?: Function;
items?: OverlayItem[];
showHeadlinePrefix?: boolean;
name?: OVERLAY_TYPES;
forceActiveFocusTrap?: boolean;
loading?: boolean;
};

export const OverlayMui: VFC<OverlayProps> = ({ name, ...overlayProps }) => {
const overlay = document.getElementById('overlay');
const { overlays, addOverlay, removeOverlay } = useContext(ModalContext);
const [unique, setUnique] = useState(null);

useEffect(() => {
const unique = uuid();

addOverlay({
id: unique,
name: name
});
setUnique(unique);

return () => {
removeOverlay(unique);
};
}, [addOverlay, name, removeOverlay]);

if (
!unique ||
overlays.findIndex((overlay) => overlay.id === unique) !== 0
) {
return null;
}

return (
overlay && createPortal(<OverlayContent {...overlayProps} />, overlay)
);
};

const OverlayContent: VFC<Omit<OverlayProps, 'name'>> = (props) => {
const { t: translate } = useTranslation();
const [activeStep, setActiveStep] = useState<number>(0);
const [activeOverlay, setActiveOverlay] = useState<OverlayItem>(
props.item
? { ...props.item, ...props.handleOverlay }
: props.items[activeStep]
);

useEffect(() => {
setActiveOverlay(
props.item
? { ...props.item, ...props.handleOverlay }
: props.items[activeStep]
);
}, [props.item, props.items]); // eslint-disable-line react-hooks/exhaustive-deps

useEffect(() => {
document.querySelector('.app')?.classList.add('app--blur');

return () => {
document.querySelector('.app')?.classList.remove('app--blur');
};
}, []);

useEffect(() => {
if (props.items) {
setActiveOverlay(props.items[activeStep]);
}
}, [activeStep, props.items]);

const handleButtonClick = (
buttonFunction: string,
buttonArgs?: { [key: string]: any }
) => {
if (buttonFunction === OVERLAY_FUNCTIONS.NEXT_STEP) {
if (activeOverlay.handleNextStep) {
activeOverlay.handleNextStep(() => {
setActiveStep(activeStep + 1);
});
} else {
setActiveStep(activeStep + 1);
}
} else if (buttonFunction === OVERLAY_FUNCTIONS.PREV_STEP) {
setActiveStep(activeStep - 1);
} else if (props.item && props.handleOverlay) {
props.handleOverlay(buttonFunction, buttonArgs);
} else if (activeOverlay.handleOverlay) {
activeOverlay.handleOverlay(buttonFunction, buttonArgs);
}
};

const getOverlayHeadline = () => {
if (props.items?.some((item) => item.step)) {
return `
<span class="overlay__stepHeadline">
${
props.showHeadlinePrefix ? (
<span className="overlay__stepHeadline--prefix">
${activeStep + 1}$
{translate('overlay.step.headline.prefix')}
</span>
) : (
''
)
}
${translate(activeOverlay.headline)}
</span>
`;
} else return translate(activeOverlay.headline);
};

const Illustration = activeOverlay.svg;

return (
<Dialog
open={true}
maxWidth="md"
fullWidth
className={clsx(
props.className,
'overlay-mui',
props.items?.length > 0 && 'overlay-mui--stepped',
activeOverlay.svg && 'overlay-mui--illustration'
)}
PaperProps={{
className: 'overlay-mui__paper'
}}
BackdropProps={{
className: 'overlay-mui__backdrop'
}}
disableEscapeKeyDown={!props.handleOverlayClose && !activeOverlay.showCloseButton}
>
<DialogContent className={`overlay-mui__content ${props.loading ? 'overlay-mui__loading' : ''}`.trim()}>
{props.loading && <LoadingIndicator />}
{!props.loading && (
<>
{props.handleOverlayClose && (
<IconButton
className="overlay-mui__closeIcon"
onClick={(e) => props.handleOverlayClose(e)}
aria-label={translate('app.close')}
size="small"
>
<CloseIcon />
</IconButton>
)}
{activeOverlay.showCloseButton &&
!props.handleOverlayClose && (
<IconButton
className="overlay-mui__closeIcon"
onClick={() =>
handleButtonClick(
OVERLAY_FUNCTIONS.CLOSE
)
}
aria-label={translate('app.close')}
size="small"
>
<CloseIcon />
</IconButton>
)}
{props.items?.some((item) => item.step) && (
<div className="overlay-mui__steps">
{props.items.map((item, i) => {
if (item.step) {
const StepIcon = item.step?.icon;
return (
<div
className={clsx(
'overlay-mui__step',
{
'overlay-mui__step--active':
i ===
activeStep,
'overlay-mui__step--disabled':
i > activeStep
}
)}
key={i}
>
<div className="overlay-mui__stepContent">
<div className="overlay-mui__stepIcon">
<StepIcon
title={
item.step
.label
}
aria-label={
item.step
.label
}
/>
</div>
<Text
text={translate(
item.step.label
)}
type="divider"
/>
</div>
</div>
);
} else return null;
})}
</div>
)}
{activeOverlay.svg && (
<div
className={`${
activeOverlay.illustrationStyle ===
'large'
? 'overlay-mui__illustrationWrapper--large'
: 'overlay-mui__illustrationWrapper'
}`}
>
<span
className={`overlay-mui__illustration ${
activeOverlay.illustrationBackground
? `overlay-mui__illustration--${activeOverlay.illustrationBackground}`
: ''
}`}
>
<Illustration
aria-hidden="true"
focusable="false"
title=""
/>
</span>
</div>
)}
{activeOverlay.headline && (
<Headline
semanticLevel="3"
text={getOverlayHeadline()}
styleLevel={
activeOverlay.headlineStyleLevel
}
/>
)}
{activeOverlay.copy && (
<Text
text={translate(activeOverlay.copy)}
type="standard"
/>
)}
{activeOverlay.nestedComponent && (
<div className="overlay-mui__nestedComponent">
{activeOverlay.nestedComponent}
</div>
)}
{activeOverlay.buttonSet &&
activeOverlay.buttonSet.length > 0 && (
<div className="overlay-mui__buttons">
{activeOverlay.buttonSet?.map(
(item, i) => (
<Button
disabled={item.disabled}
item={item}
key={`${i}-${item.type}`}
buttonHandle={
handleButtonClick
}
/>
)
)}
</div>
)}
</>
)}
</DialogContent>
</Dialog>
);
};
