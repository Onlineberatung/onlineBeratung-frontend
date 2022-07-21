import * as React from 'react';
import { Button, BUTTON_TYPES } from '../button/Button';
import { MessageSubmitInfo } from '../messageSubmitInterface/MessageSubmitInfo';
import { translate } from '../../utils/translate';
import { history } from '../app/app';

export const RoomNotFound = () => {
	return (
		<div>
			<MessageSubmitInfo
				isInfo={true}
				infoMessage={
					<div>
						<p>
							{translate('e2ee.roomNotFound.notice.line1')}
							<br />
							{translate('e2ee.roomNotFound.notice.line2')}
							<br />
							{translate('e2ee.roomNotFound.notice.line3')}
							<br />
							<Button
								buttonHandle={() => {
									history.go(0);
								}}
								item={{
									type: BUTTON_TYPES.LINK_INLINE,
									label: translate(
										'e2ee.roomNotFound.notice.link'
									)
								}}
								isLink={true}
							/>
						</p>
					</div>
				}
			/>
		</div>
	);
};
