import React, { FC, useContext, useMemo, useState } from 'react';
import './dragAndDropArea.styles';
import { DropzoneState, useDropzone } from 'react-dropzone';
import clsx from 'clsx';
import { ReactComponent as UploadIcon } from '../../resources/img/icons/upload.svg';
import { useTranslation } from 'react-i18next';
import { ATTACHMENT_MAX_SIZE_IN_MB } from '../messageSubmitInterface/attachmentHelpers';
import { GlobalDragAndDropContext } from '../../globalState/provider/GlobalDragAndDropProvider';
import {
	AUTHORITIES,
	hasUserAuthority,
	SessionTypeContext,
	UserDataContext,
	useTenant
} from '../../globalState';
import { SESSION_LIST_TYPES } from '../session/sessionHelpers';

interface DragAndDropAreaProps {
	styleOverride?: React.CSSProperties;
	className?: string;
}

export const DragAndDropAreaContext = React.createContext<
	Omit<DropzoneState, 'getRootProps'> & {
		attachment: File;
		setAttachment: (file: File) => void;
	}
>(null);

export const DragAndDropArea: FC<DragAndDropAreaProps> = ({
	children,
	styleOverride,
	className
}) => {
	const { t: translate } = useTranslation();
	const tenant = useTenant();

	const { type } = useContext(SessionTypeContext);
	const { userData } = useContext(UserDataContext);
	const { isDragActive } = useContext(GlobalDragAndDropContext);

	const [attachment, setAttachment] = useState(null);

	const uploadDisabled = useMemo(
		() =>
			type === SESSION_LIST_TYPES.ENQUIRY &&
			!hasUserAuthority(AUTHORITIES.VIEW_ALL_PEER_SESSIONS, userData) &&
			!tenant?.settings?.featureAttachmentUploadDisabled,
		[tenant?.settings?.featureAttachmentUploadDisabled, type, userData]
	);

	const { getRootProps, ...dropzoneState } = useDropzone({
		noClick: true,
		noKeyboard: true,
		multiple: false,
		maxSize: ATTACHMENT_MAX_SIZE_IN_MB * 1024 * 1024,
		onDrop: ([file]) => setAttachment(file),
		accept: {
			'image/jpeg': ['.jpg', '.jpeg'],
			'image/png': ['.png'],
			'application/pdf': ['.pdf'],
			'application/msword': ['.doc'],
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
				['.docx'],
			'application/vnd.ms-excel': ['.xls'],
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
				['.xlsx']
		},
		disabled: uploadDisabled
	});

	return (
		<div
			className={clsx(className, 'dragAndDropArea__wrapper')}
			{...getRootProps()}
		>
			<DragAndDropAreaContext.Provider
				value={{ attachment, setAttachment, ...dropzoneState }}
			>
				{children}
				{!uploadDisabled && (
					<div
						className={clsx(
							'dragAndDropArea',
							isDragActive && 'enabled'
						)}
						style={styleOverride}
					>
						<div
							className={clsx(
								'dropContainer',
								dropzoneState.isDragActive && 'can-drop'
							)}
						>
							<UploadIcon className="dropContainer__icon" />
							<div className="dropContainer__explanation">
								{translate(
									dropzoneState.isDragActive
										? 'session.dragAndDrop.explanation.insideDropArea'
										: 'session.dragAndDrop.explanation.outsideDropArea'
								)}
							</div>
							<div className="dropContainer__restrictions">
								{translate('session.dragAndDrop.restrictions', {
									attachment_filesize:
										ATTACHMENT_MAX_SIZE_IN_MB
								})}
							</div>
						</div>
					</div>
				)}
			</DragAndDropAreaContext.Provider>
		</div>
	);
};
