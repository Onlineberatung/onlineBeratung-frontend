import * as React from 'react';
import { useEffect, useState } from 'react';
import { translate } from '../../utils/translate';
import { ReactComponent as CopyIcon } from '../../resources/img/icons/documents.svg';
import { ReactComponent as CheckmarkIcon } from '../../resources/img/icons/checkmark.svg';
import { copyTextToClipboard } from '../../utils/clipboardHelpers';

interface CopyMessageProps {
	right: Boolean;
	message: string;
}

export const CopyMessage = (props: CopyMessageProps) => {
	const [messageCopied, setMessageCopied] = useState(false);
	let timeoutId: number = null;

	useEffect(() => {
		return () => {
			// Unset timeout on unmounting to prevent state change on unmounted components
			if (timeoutId) window.clearTimeout(timeoutId);
		};
	});

	const copyText = async (content) => {
		await copyTextToClipboard(content, () => {
			setMessageCopied(true);
			timeoutId = window.setTimeout(() => setMessageCopied(false), 3000);
		});
	};

	return (
		<div
			className={
				props.right
					? `messageItem__action messageItem__action--right`
					: `messageItem__action`
			}
			title={translate('message.copy.title')}
			role="button"
			aria-label={translate('message.copy.title')}
			onClick={() => copyText(props.message)}
		>
			<CopyIcon
				className={!messageCopied ? `copy` : `copy copy--active`}
			/>
			<CheckmarkIcon
				className={
					!messageCopied ? `success` : `success success--active`
				}
			/>
		</div>
	);
};
