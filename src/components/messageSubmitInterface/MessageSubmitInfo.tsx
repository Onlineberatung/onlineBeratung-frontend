import * as React from 'react';
import { ReactComponent as InfoIcon } from '../../resources/img/icons/i.svg';
import { ReactComponent as ErrorIcon } from '../../resources/img/icons/exclamation-mark.svg';
import './messageSubmitInfo.styles';
import { useTranslation } from 'react-i18next';
import { getContact } from '../../globalState';
import { ATTACHMENT_MAX_SIZE_IN_MB } from './attachmentHelpers';
import { useCallback, useContext, useMemo, useState } from 'react';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { Button, BUTTON_TYPES } from '../button/Button';
import { useHistory } from 'react-router-dom';
import {
	ALIAS_MESSAGE_TYPES,
	apiSendAliasMessage
} from '../../api/apiSendAliasMessage';
import { Overlay } from '../overlay/Overlay';
import { subscriptionKeyLostOverlayItem } from '../session/subscriptionKeyLostHelper';

export enum INFO_TYPES {
	ABSENT = 'ABSENT',
	ARCHIVED = 'ARCHIVED',
	ATTACHMENT_SIZE_ERROR = 'ATTACHMENT_SIZE_ERROR',
	ATTACHMENT_FORMAT_ERROR = 'ATTACHMENT_FORMAT_ERROR',
	ATTACHMENT_QUOTA_REACHED_ERROR = 'ATTACHMENT_QUOTA_REACHED_ERROR',
	ATTACHMENT_MULTIPLE_ERROR = 'ATTACHMENT_MULTIPLE_ERROR',
	ATTACHMENT_OTHER_ERROR = 'ATTACHMENT_OTHER_ERROR',
	FINISHED_CONVERSATION = 'FINISHED_CONVERSATION',
	SUBSCRIPTION_KEY_LOST = 'SUBSCRIPTION_KEY_LOST',
	ROOM_NOT_FOUND = 'ROOM_NOT_FOUND'
}

export type InfoTypes =
	| typeof INFO_TYPES.ABSENT
	| typeof INFO_TYPES.ARCHIVED
	| typeof INFO_TYPES.ATTACHMENT_SIZE_ERROR
	| typeof INFO_TYPES.ATTACHMENT_FORMAT_ERROR
	| typeof INFO_TYPES.ATTACHMENT_QUOTA_REACHED_ERROR
	| typeof INFO_TYPES.ATTACHMENT_MULTIPLE_ERROR
	| typeof INFO_TYPES.ATTACHMENT_OTHER_ERROR
	| typeof INFO_TYPES.FINISHED_CONVERSATION
	| typeof INFO_TYPES.SUBSCRIPTION_KEY_LOST
	| typeof INFO_TYPES.ROOM_NOT_FOUND;

export interface MessageSubmitInfoInterface {
	activeInfo: InfoTypes;
}

type InfoType = {
	isInfo: boolean;
	infoHeadline?: string;
	infoMessage?: JSX.Element;
};

export const MessageSubmitInfo = ({
	activeInfo
}: MessageSubmitInfoInterface) => {
	const { t: translate } = useTranslation();
	const history = useHistory();

	const { activeSession, reloadActiveSession } =
		useContext(ActiveSessionContext);

	const [overlayActive, setOverlayActive] = useState(false);

	const handleButton = useCallback(() => {
		apiSendAliasMessage({
			rcGroupId: activeSession.rid,
			type: ALIAS_MESSAGE_TYPES.MASTER_KEY_LOST
		})
			.then(reloadActiveSession)
			.catch((e) => console.error(e));
	}, [activeSession.rid, reloadActiveSession]);

	const { isInfo, infoHeadline, infoMessage } = useMemo<InfoType>(() => {
		switch (activeInfo) {
			case INFO_TYPES.ABSENT:
				return {
					isInfo: true,
					infoHeadline: `${
						getContact(
							activeSession,
							translate('sessionList.user.consultantUnknown')
						).displayName ||
						getContact(
							activeSession,
							translate('sessionList.user.consultantUnknown')
						).username
					} ${translate('consultant.absent.message')} `,
					infoMessage: <>{activeSession.consultant.absenceMessage}</>
				};
			case INFO_TYPES.ATTACHMENT_SIZE_ERROR:
				return {
					isInfo: false,
					infoHeadline: translate('attachments.error.size.headline'),
					infoMessage: translate('attachments.error.size.message', {
						attachment_filesize: ATTACHMENT_MAX_SIZE_IN_MB
					})
				};
			case INFO_TYPES.ATTACHMENT_FORMAT_ERROR:
				return {
					isInfo: false,
					infoHeadline: translate(
						'attachments.error.format.headline'
					),
					infoMessage: translate('attachments.error.format.message')
				};
			case INFO_TYPES.ATTACHMENT_QUOTA_REACHED_ERROR:
				return {
					isInfo: false,
					infoHeadline: translate('attachments.error.quota.headline'),
					infoMessage: translate('attachments.error.quota.message')
				};
			case INFO_TYPES.ATTACHMENT_OTHER_ERROR:
			case INFO_TYPES.ATTACHMENT_MULTIPLE_ERROR:
				return {
					isInfo: false,
					infoHeadline: translate('attachments.error.other.headline'),
					infoMessage: translate('attachments.error.other.message')
				};
			case INFO_TYPES.FINISHED_CONVERSATION:
				return {
					isInfo: true,
					infoHeadline: translate(
						'anonymous.session.infoMessage.chatFinished'
					)
				};
			case INFO_TYPES.ARCHIVED:
				return {
					isInfo: true,
					infoHeadline: translate('archive.submitInfo.headline'),
					infoMessage: translate('archive.submitInfo.message')
				};
			case INFO_TYPES.ROOM_NOT_FOUND:
				return {
					isInfo: true,
					infoMessage: (
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
					)
				};
			case INFO_TYPES.SUBSCRIPTION_KEY_LOST:
				return {
					isInfo: true,
					infoMessage: (
						<div>
							<p>
								{translate(
									'e2ee.subscriptionKeyLost.notice.title'
								)}
								<br />
								{translate(
									'e2ee.subscriptionKeyLost.notice.text'
								)}{' '}
								<Button
									buttonHandle={() => setOverlayActive(true)}
									item={{
										type: BUTTON_TYPES.LINK_INLINE,
										label: translate(
											'e2ee.subscriptionKeyLost.notice.more'
										)
									}}
									isLink={true}
								/>
							</p>
							{activeSession?.item?.lastMessageType !==
								ALIAS_MESSAGE_TYPES.MASTER_KEY_LOST && (
								<div>
									<Button
										buttonHandle={handleButton}
										item={{
											type: BUTTON_TYPES.PRIMARY,
											label: translate(
												'e2ee.subscriptionKeyLost.notice.link'
											)
										}}
									/>
								</div>
							)}
						</div>
					)
				};
			default:
				return {
					isInfo: false
				};
		}
	}, [activeInfo, activeSession, handleButton, history, translate]);

	return (
		<>
			<div className="messageSubmitInfoWrapper">
				{infoHeadline && (
					<div
						className={
							isInfo
								? 'messageSubmitInfoWrapper__headlineWrapper'
								: 'messageSubmitInfoWrapper__headlineWrapper messageSubmitInfoWrapper__headlineWrapper--red'
						}
					>
						<span className="messageSubmitInfoWrapper__icon">
							{isInfo ? (
								<InfoIcon
									title={translate('notifications.info')}
									aria-label={translate('notifications.info')}
								/>
							) : (
								<ErrorIcon
									title={translate('notifications.error')}
									aria-label={translate(
										'notifications.error'
									)}
								/>
							)}
						</span>
						<span
							className={
								isInfo
									? 'messageSubmitInfoWrapper__headline'
									: 'messageSubmitInfoWrapper__headline messageSubmitInfoWrapper__headline--red'
							}
						>
							{infoHeadline}
						</span>
					</div>
				)}

				{infoMessage && (
					<div
						className={
							isInfo
								? 'messageSubmitInfoWrapper__message'
								: 'messageSubmitInfoWrapper__message messageSubmitInfoWrapper__message--red'
						}
					>
						{infoMessage}
					</div>
				)}
			</div>
			{overlayActive && (
				<Overlay
					item={subscriptionKeyLostOverlayItem}
					handleOverlay={() => setOverlayActive(false)}
					handleOverlayClose={() => setOverlayActive(false)}
				/>
			)}
		</>
	);
};
