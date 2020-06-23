import * as React from 'react';
import { useState } from 'react';
import { translate } from '../../../../resources/ts/i18n/translate';

interface CopyIconProps {
	right: Boolean;
	message: string;
}

export const CopyIcon = (props: CopyIconProps) => {
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
		>
			<a
				title={translate('message.copy.title')}
				href="#"
				onClick={(e) => {
					e.preventDefault();
					copyText(props.message);
				}}
			>
				<svg
					className={!messageCopied ? `copy` : `copy copy--active`}
					width="20"
					height="20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M.667 5.333H14c.368 0 .667.299.667.667v13.333A.667.667 0 0 1 14 20H.667A.667.667 0 0 1 0 19.333V6c0-.368.298-.667.667-.667zm1.666 2.334v10h10v-10h-10zm14.334 7v-2.334h1v-10h-10v1H5.333V2a2 2 0 0 1 2-2H18a2 2 0 0 1 2 2v10.667a2 2 0 0 1-2 2h-1.333z"
						fill="#000"
						fillRule="nonzero"
					/>
				</svg>
				<svg
					className={
						!messageCopied ? `success` : `success success--active`
					}
					xmlns="http://www.w3.org/2000/svg"
					width="72"
					height="72"
					viewBox="0 0 72 72"
				>
					<path
						id="checkmark-a"
						d="M7.25269842,33.2086244 L7.25269842,33.2086244 C8.79968309,31.139936 11.7307652,30.7170117 13.7994536,32.2639963 C13.9758883,32.3959359 14.1427805,32.5401766 14.2988833,32.6956411 L29.2722338,47.6077543 L57.1900353,8.91834707 C58.6841829,6.84770824 61.5740132,6.38036974 63.6446521,7.87451731 C63.8009903,7.98732906 63.9501193,8.10980903 64.0911656,8.24123988 L64.0911656,8.24123988 C66.2871831,10.2875493 66.6320903,13.642246 64.8983875,16.0925826 L31.9438937,62.6689641 C31.3059119,63.5706586 30.0577576,63.7844399 29.1560631,63.1464581 C29.0579244,63.0770214 28.9662462,62.9988775 28.8821421,62.9129755 L7.79547562,41.3755491 C5.62571417,39.1594056 5.39529652,35.6924148 7.25269842,33.2086244 Z"
					/>
				</svg>
			</a>
		</div>
	);
};
