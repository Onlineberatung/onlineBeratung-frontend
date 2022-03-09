import { OverlayItem } from '../overlay/Overlay';
import { ReactComponent as XIcon } from '../../resources/img/illustrations/x.svg';

export const bannedUserOverlay: OverlayItem = {
	svg: XIcon,
	illustrationBackground: 'large',
	headline: 'Sie wurden gebannt.', // TODO i18n
	copy: 'Sie haben gegen unsere Spielregeln im Chat verstoßen. Unsere Spielregeln stehen finden Sie immer auf der ersten Seite des Chats. Wenn Sie sich an die Regeln halten, heißt Sie Ihr_e Moderator_in wieder herzlich Willkommen.' // TODO i18n
};
