import * as React from 'react';
import { useEffect, useState } from 'react';
import { translate } from '../../utils/translate';
import { ReactComponent as CopyIcon } from '../../resources/img/icons/documents.svg';
import { ReactComponent as CheckmarkIcon } from '../../resources/img/icons/checkmark.svg';

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

	const copyFallback = (content) => {
		let div = document.createElement('div');
		let textarea = document.createElement('textarea');
		div.style.position = 'absolute';
		div.style.top = div.style.left = '-10000em';
		document.body.appendChild(div);
		document.body.appendChild(textarea);
		div.innerHTML = content;
		document.execCommand('copy');
		// just copy text content because we can't copy richtext in fallback
		textarea.value = (
			div.textContent === undefined ? div.innerText : div.textContent
		).trim();
		textarea.focus();
		textarea.select();
		document.execCommand('copy');
		document.body.removeChild(div);
		document.body.removeChild(textarea);
	};

	const copyClipboard = (content) => {
		function listener(e) {
			e.preventDefault();
			e.clipboardData.setData('text/html', content);
			e.clipboardData.setData('text/plain', content);
		}

		document.addEventListener('copy', listener);
		document.execCommand('copy');
		document.removeEventListener('copy', listener);
	};

	const copyText = async (content) => {
		if (window.ClipboardEvent) {
			copyClipboard(content);
		} else {
			copyFallback(content);
		}

		setMessageCopied(true);
		timeoutId = window.setTimeout(() => setMessageCopied(false), 3000);
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
