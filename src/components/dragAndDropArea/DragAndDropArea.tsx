import React, { useCallback, useState } from 'react';
import './dragAndDropArea.styles';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';
import { ReactComponent as UploadIcon } from '../../resources/img/icons/upload.svg';
import { useTranslation } from 'react-i18next';
import { ATTACHMENT_MAX_SIZE_IN_MB } from '../messageSubmitInterface/attachmentHelpers';

interface DragAndDropAreaProps {
	onFileDragged: (file: File) => void;
	isDragging: boolean;
	canDrop: boolean;
	onDragLeave: () => void;
	styleOverride?: React.CSSProperties;
}

export const DragAndDropArea = (props: DragAndDropAreaProps) => {
	const { t: translate } = useTranslation();
	const [canDrop, setCanDrop] = useState(false);
	const onDrop = useCallback(
		(acceptedFiles) => props.onFileDragged(acceptedFiles[0]),
		[props]
	);
	const onDragEnter = () => setCanDrop(true);
	const onDragLeave = () => {
		setCanDrop(false);
		props.onDragLeave();
	};

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		noClick: true,
		onDragEnter,
		onDragLeave
	});

	return (
		<div
			className={clsx('dragAndDropArea', props.isDragging && 'enabled')}
			style={props.styleOverride}
			{...getRootProps()}
		>
			<div className={clsx('dropContainer', canDrop && 'can-drop')}>
				<input {...getInputProps()} />
				<UploadIcon className="dropContainer__icon" />
				<div className="dropContainer__explanation">
					{translate(
						canDrop
							? 'session.dragAndDrop.explanation.insideDropArea'
							: 'session.dragAndDrop.explanation.outsideDropArea'
					)}
				</div>
				<div className="dropContainer__restrictions">
					{translate('session.dragAndDrop.restrictions', {
						attachment_filesize: ATTACHMENT_MAX_SIZE_IN_MB
					})}
				</div>
			</div>
		</div>
	);
};
