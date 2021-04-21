import * as React from 'react';
import { useState } from 'react';
import { translate } from '../../utils/translate';
import { ReactComponent as CopyIcon } from '../../resources/img/icons/documents.svg';
import { ReactComponent as CheckmarkIcon } from '../../resources/img/icons/checkmark.svg';

interface CopyMessageProps {
	right: Boolean;
	message: string;
}

export const CopyMessage = (props: CopyMessageProps) => {
	const [messageCopied, setMessageCopied] = useState(false);

	const copyText = (content) => {
		let div = document.createElement('div');
		let textarea = document.createElement('textarea');
		// hide it
		div.style.position = 'absolute';
		div.style.top = div.style.left = '-10000em';
		// add it to dom
		document.body.appendChild(div);
		document.body.appendChild(textarea);
		// set values
		div.innerHTML = content;
		textarea.value = div.innerHTML.trim();
		textarea.select();
		// copy it
		document.execCommand('copy');
		// clean up
		document.body.removeChild(div);
		document.body.removeChild(textarea);

		setMessageCopied(true);
		setTimeout(() => setMessageCopied(false), 3000);
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
