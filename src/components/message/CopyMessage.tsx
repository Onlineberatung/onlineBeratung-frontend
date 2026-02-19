import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import CopyIcon from '@mui/icons-material/ContentCopy';
import CheckmarkIcon from '@mui/icons-material/Check';
import { copyTextToClipboard } from '../../utils/clipboardHelpers';
import { useTranslation } from 'react-i18next';

interface CopyMessageProps {
	right: boolean;
	message: string;
}

export const CopyMessage = (props: CopyMessageProps) => {
	const { t: translate } = useTranslation();
	const [messageCopied, setMessageCopied] = useState(false);
	const timeoutId = useRef<number>(null);

	useEffect(() => {
		return () => {
			// Unset timeout on unmounting to prevent state change on unmounted components
			if (timeoutId.current) window.clearTimeout(timeoutId.current);
		};
	}, []);

	const copyText = async (content) => {
		await copyTextToClipboard(content, () => {
			setMessageCopied(true);
			timeoutId.current = window.setTimeout(
				() => setMessageCopied(false),
				3000
			);
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
