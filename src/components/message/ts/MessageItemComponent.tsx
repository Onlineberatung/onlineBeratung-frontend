import * as React from 'react';
import { useContext } from 'react';
import { getSessionsListItemDate } from '../../sessionsListItem/ts/sessionsListItemHelpers';
import {
	UserDataContext,
	ActiveSessionGroupIdContext,
	SessionsDataContext,
	getActiveSession,
	hasUserAuthority,
	AUTHORITIES
} from '../../../globalState';
import {
	SESSION_TYPES,
	getChatItemForSession
} from '../../session/ts/sessionHelpers';
import { ForwardIcon } from './actions/ForwardIcon';
import { MessageMetaData } from './MessageMetaData';
import { CopyIcon } from './actions/CopyIcon';
import { MessageUsername } from './MessageUsername';
import { getIconForAttachmentType } from '../../messageSubmitInterface/ts/messageSubmitInterfaceComponent';
import { translate } from '../../../resources/ts/i18n/translate';
import {
	ATTACHMENT_TRANSLATE_FOR_TYPE,
	getAttachmentSizeMBForKB
} from '../../messageSubmitInterface/ts/attachmentHelpers';
import { tld } from '../../../resources/ts/config';
import { markdownToDraft } from 'markdown-draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromRaw } from 'draft-js';

export interface MessageItem {
	id?: number;
	message: string;
	messageDate: string | number;
	messageTime: string;
	username?: string;
	askerRcId?: string;
	userId?: string;
	consultant?: {
		username: string;
	};
	groupId?: string;
	isNotRead?: boolean;
	alias?: any;
	attachments?: any;
	file?: any;
}

interface MessageItemComponentProps extends MessageItem {
	isOnlyEnquiry?: boolean;
	isMyMessage: boolean;
	type: string;
	clientName: string;
}

// TODO: Split this component into parts for every type of message.
export const MessageItemComponent = (props: MessageItemComponentProps) => {
	const { userData } = useContext(UserDataContext);
	const { sessionsData } = useContext(SessionsDataContext);
	const { activeSessionGroupId } = useContext(ActiveSessionGroupIdContext);
	const activeSession = getActiveSession(activeSessionGroupId, sessionsData);
	const rawMessageObject = markdownToDraft(props.message);
	const contentStateMessage = convertFromRaw(rawMessageObject);
	const renderedMessage = stateToHTML(contentStateMessage);
	const chatItem = getChatItemForSession(activeSession);

	const getMessageDate = () => {
		if (props.messageDate) {
			return (
				<div className="messageItem__date">
					{typeof props.messageDate === 'number'
						? getSessionsListItemDate(props.messageDate)
						: props.messageDate}
				</div>
			);
		}
		return null;
	};

	const hasForwardIcon = () => {
		const showForwardIcon =
			activeSession.type !== SESSION_TYPES.ENQUIRY &&
			chatItem.feedbackGroupId &&
			hasUserAuthority(AUTHORITIES.USE_FEEDBACK, userData) &&
			!activeSession.isFeedbackSession;

		if (!showForwardIcon) {
			return null;
		}
		return (
			<ForwardIcon
				right={props.isMyMessage}
				message={props.message}
				messageTime={props.messageTime}
				askerRcId={props.askerRcId}
				groupId={chatItem.feedbackGroupId}
				username={props.username}
			></ForwardIcon>
		);
	};

	const hasCopyIcon = () => {
		if (!activeSession.isFeedbackSession) {
			return null;
		}
		return (
			<CopyIcon
				right={props.isMyMessage}
				message={renderedMessage}
			></CopyIcon>
		);
	};

	const getType = () => {
		if (props.isMyMessage) {
			return 'self';
		}
		if (props.alias) {
			return 'forwarded';
		}
		if (props.username === 'system') {
			return 'system';
		}
		if (isUserMessage()) {
			return 'user';
		}
		return 'consultant';
	};

	const isUserMessage = () =>
		props.userId === props.askerRcId ||
		(chatItem.moderators && !chatItem.moderators.includes(props.userId));
	return (
		<div
			className={
				props.isMyMessage
					? `messageItem messageItem--right`
					: `messageItem`
			}
		>
			{getMessageDate()}
			<div
				className={
					props.isMyMessage
						? `messageItem__messageWrap messageItem__messageWrap--right`
						: `messageItem__messageWrap`
				}
			>
				<MessageUsername
					alias={props.alias}
					isMyMessage={props.isMyMessage}
					isUser={isUserMessage()}
					type={getType()}
					userId={props.userId}
					username={props.username}
				></MessageUsername>

				<div
					className={
						props.isMyMessage && !props.alias
							? `messageItem__message messageItem__message--myMessage`
							: props.alias
							? `messageItem__message messageItem__message--forwarded`
							: `messageItem__message`
					}
				>
					<span
						dangerouslySetInnerHTML={{ __html: renderedMessage }}
					></span>
					{props.attachments
						? props.attachments.map((attachment, key) => (
								<div key={key}>
									<div className="messageItem__message__attachment">
										<span className="messageItem__message__attachment__icon">
											{getIconForAttachmentType(
												props.file.type
											)}
										</span>
										<span className="messageItem__message__attachment__title">
											<p>{attachment.title}</p>
											<p className="messageItem__message__attachment__meta">
												{
													ATTACHMENT_TRANSLATE_FOR_TYPE[
														props.file.type
													]
												}{' '}
												{attachment.image_size
													? `| ${
															(
																getAttachmentSizeMBForKB(
																	attachment.image_size *
																		1000
																) / 1000
															).toFixed(2) +
															translate(
																'attachments.type.label.mb'
															)
													  }`
													: null}
											</p>
										</span>
									</div>
									<a
										href={tld + attachment.title_link}
										rel="noopener noreferer"
										className="messageItem__message__attachment__download"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="72"
											height="72"
											viewBox="0 0 72 72"
										>
											<path d="M16,49 L16,56 L56,56 L56,49 L64,48.9994565 C65.1045695,48.9994565 66,49.894887 66,50.9994565 L65.9959617,61.8579999 C65.9956615,62.9623571 65.100319,63.8574563 63.9959618,63.8574563 L8,63.858 C6.8954305,63.858 6,62.9625695 6,61.858 L6,51 C6,49.8954305 6.8954305,49 8,49 L16,49 Z M51.8558419,28.5478714 L37.2253752,43.3718346 C36.8340102,43.7906115 36.3438896,44 35.7550133,44 C35.166137,44 34.6760164,43.7906115 34.2846514,43.3718346 L19.6541848,28.5478714 C18.9787449,27.9079703 18.8263442,27.1358889 19.1969827,26.2316271 C19.5676212,25.3718373 20.2101425,24.9419423 21.1245467,24.9419423 L29.4840296,24.9419423 L29.4840296,10.1179792 C29.4840296,9.54478593 29.6906849,9.04818316 30.1039956,8.62817087 C30.5173063,8.20815858 31.0074269,7.9987701 31.5743575,8.00000543 L39.9338404,8.00000543 C40.4995517,8.00000543 40.9896724,8.20939391 41.4042023,8.62817087 C41.8187321,9.04694783 42.0253875,9.5435506 42.0241683,10.1179792 L42.0241683,24.9419423 L50.3836512,24.9419423 C51.2980553,24.9419423 51.9405766,25.3718373 52.3112151,26.2316271 C52.6836824,27.1358889 52.5312817,27.9079703 51.8558419,28.5478714 Z" />
										</svg>
										<p>
											{translate(
												'attachments.download.label'
											)}
										</p>
									</a>
								</div>
						  ))
						: null}
					{hasCopyIcon()}
					{hasForwardIcon()}
				</div>

				<MessageMetaData
					isMyMessage={props.isMyMessage}
					isNotRead={props.isNotRead}
					messageTime={props.messageTime}
					type={getType()}
				></MessageMetaData>
			</div>
		</div>
	);
};
