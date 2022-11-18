import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, BUTTON_TYPES } from '../button/Button';
import { MessageSubmitInfo } from '../messageSubmitInterface/MessageSubmitInfo';

export const RoomNotFound = () => {
	const { t: translate } = useTranslation();
	const history = useHistory();

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
						</p>
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
					</div>
				}
			/>
		</div>
	);
};
