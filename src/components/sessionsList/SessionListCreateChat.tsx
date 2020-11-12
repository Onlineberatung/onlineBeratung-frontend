import * as React from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import { SVG } from '../svgSet/SVG';
import { ICON_KEYS } from '../svgSet/SVGHelpers';
import './sessionsList.styles';

export const SessionListCreateChat = () => {
	return (
		<div className="sessionsListItem sessionsListItem--active createChatItem">
			<div className="sessionsListItem__content sessionsListItem__content--active">
				<div className="sessionsListItem__row">
					<div className="sessionsListItem__consultingType"></div>
				</div>
				<div className="sessionsListItem__row">
					<SVG
						name={ICON_KEYS.SPEECH_BUBBLE}
						className="sessionsListItem__icon"
					/>
					<div className="sessionsListItem__username">
						{translate('groupChat.create.listItem.label')}
					</div>
				</div>
				<div className="sessionsListItem__row">
					<div className="sessionsListItem__subject"></div>
					<div className="sessionsListItem__date"></div>
				</div>
			</div>
		</div>
	);
};
