import * as React from 'react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BackIcon from '@mui/icons-material/ArrowBack';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

import { SESSION_LIST_TAB } from '../session/sessionHelpers';
import {
	SessionTypeContext,
	ActiveSessionProvider,
	ActiveSessionContext
} from '../../globalState';
import { Loading } from '../app/Loading';
import { useSearchParam } from '../../hooks/useSearchParams';
import { useSession } from '../../hooks/useSession';
import { useResponsive } from '../../hooks/useResponsive';
import {
	desktopView,
	mobileListView,
	mobileUserProfileView
} from '../app/navigationHandler';
import { apiGetSessionData } from '../../api';
import { prepareMessages } from '../session/sessionHelpers';
import { DocumentItem, DocumentList } from './DocumentLibraryItem';
import { RocketChatUsersOfRoomProvider } from '../../globalState/provider/RocketChatUsersOfRoomProvider';
import './documentLibrary.styles.scss';

export const DocumentLibrary = () => {
	const { rcGroupId: groupIdFromParam } = useParams<{ rcGroupId: string }>();
	const history = useHistory();

	const { path: listPath } = useContext(SessionTypeContext);
	const { session: activeSession, ready } = useSession(groupIdFromParam);
	const sessionListTab = useSearchParam<SESSION_LIST_TAB>('sessionListTab');

	useEffect(() => {
		if (!ready || activeSession) {
			return;
		}
		history.push(
			listPath +
				(sessionListTab ? `?sessionListTab=${sessionListTab}` : '')
		);
	}, [activeSession, history, listPath, ready, sessionListTab]);

	const { fromL } = useResponsive();
	useEffect(() => {
		if (!fromL) {
			mobileUserProfileView();
			return () => {
				mobileListView();
			};
		}
		desktopView();
	}, [fromL]);

	if (!activeSession) {
		return <Loading />;
	}

	return (
		<ActiveSessionProvider activeSession={activeSession}>
			<RocketChatUsersOfRoomProvider>
				<DocumentLibraryContent
					listPath={listPath}
					sessionListTab={sessionListTab}
				/>
			</RocketChatUsersOfRoomProvider>
		</ActiveSessionProvider>
	);
};

interface DocumentLibraryContentProps {
	listPath: string;
	sessionListTab: SESSION_LIST_TAB | null;
}

const DocumentLibraryContent = ({
	listPath,
	sessionListTab
}: DocumentLibraryContentProps) => {
	const { t: translate } = useTranslation();
	const { activeSession } = useContext(ActiveSessionContext);
	const [documents, setDocuments] = useState<DocumentItem[]>([]);
	const [loading, setLoading] = useState(true);
	const abortController = useRef<AbortController>(null);

	const backLink = `${listPath}/${activeSession.item.groupId}/${
		activeSession.item.id
	}${sessionListTab ? `?sessionListTab=${sessionListTab}` : ''}`;

	const loadDocuments = useCallback(async () => {
		if (abortController.current) {
			abortController.current.abort();
		}
		abortController.current = new AbortController();

		try {
			const messagesData = await apiGetSessionData(
				activeSession.rid,
				abortController.current.signal
			);
			if (messagesData && messagesData.messages) {
				const messages = prepareMessages(messagesData.messages);
				const docs = messages
					.filter(
						(msg) =>
							msg.attachments &&
							msg.attachments.length > 0 &&
							msg.file &&
							msg.t !== 'rm'
					)
					.map((msg) => ({
						attachment: msg.attachments[0],
						file: msg.file,
						t: msg.t,
						ts: msg.messageTime
					}));
				setDocuments(docs);
			}
		} catch (e) {
			// aborted or error – leave documents empty
		} finally {
			setLoading(false);
		}
	}, [activeSession.rid]);

	useEffect(() => {
		loadDocuments();
		return () => {
			abortController.current?.abort();
		};
	}, [loadDocuments]);

	return (
		<div className="documentLibraryPage__wrapper">
			<div className="documentLibraryPage__header">
				<div className="documentLibraryPage__header__wrapper">
					<Link
						to={backLink}
						className="documentLibraryPage__header__backButton"
					>
						<BackIcon
							aria-label={translate('app.back')}
							titleAccess={translate('app.back')}
						/>
					</Link>
					<h3 className="documentLibraryPage__header__title">
						{translate('documentLibrary.title')}
					</h3>
				</div>
			</div>
			<div className="documentLibraryPage__innerWrapper">
				<div className="documentLibraryPage__iconWrapper">
					<FolderOpenIcon className="documentLibraryPage__folderIcon" />
				</div>
				<div className="documentLibraryPage__content">
					{loading ? (
						<Loading />
					) : (
						<DocumentList
							documents={documents}
							emptyLabel={translate('documentLibrary.empty')}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
