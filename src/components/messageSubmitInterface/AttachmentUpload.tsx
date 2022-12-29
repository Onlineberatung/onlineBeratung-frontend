import { forwardRef, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ClipIcon } from '../../resources/img/icons/clip.svg';
import { ReactComponent as RemoveIcon } from '../../resources/img/icons/x.svg';
import { DragAndDropAreaContext } from '../dragAndDropArea/DragAndDropArea';
import { getIconForAttachmentType } from '../message/messageHelpers';
import * as React from 'react';

export const AttachmentUpload = forwardRef<
	HTMLSpanElement,
	{
		onDelete: Function;
	}
>(({ onDelete }, ref) => {
	const { t: translate } = useTranslation();

	const { attachment, getInputProps } = useContext(DragAndDropAreaContext);

	const getAttachmentIcon = useCallback((type: string) => {
		const Icon = getIconForAttachmentType(type);
		if (Icon) {
			return <Icon aria-hidden="true" focusable="false" />;
		}
		return null;
	}, []);

	if (attachment) {
		return (
			<div className="textarea__attachmentWrapper">
				<span className="textarea__attachmentSelected">
					<span
						className="textarea__attachmentSelected__progress"
						ref={ref}
					></span>
					<span className="textarea__attachmentSelected__labelWrapper">
						{getAttachmentIcon(attachment.type)}
						<p className="textarea__attachmentSelected__label">
							{attachment.name}
						</p>
						<span className="textarea__attachmentSelected__remove">
							<RemoveIcon
								onClick={() => onDelete()}
								title={translate('app.remove')}
								aria-label={translate('app.remove')}
							/>
						</span>
					</span>
				</span>
			</div>
		);
	}

	return (
		<label className="textarea__attachmentSelect">
			<ClipIcon
				aria-label={translate('enquiry.write.input.attachement')}
				title={translate('enquiry.write.input.attachement')}
			/>
			<input
				className="textarea__attachmentInput"
				id="dataUpload"
				name="dataUpload"
				{...getInputProps()}
			/>
		</label>
	);
});
