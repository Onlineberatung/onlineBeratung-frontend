import * as React from 'react';
import './infoText.styles';

export interface InfoTextProps {
	text: string;
	labelType?: LABEL_TYPES;
	className?: string;
}

export enum LABEL_TYPES {
	NOTICE = 'NOTICE'
}

const getLabelContent = (type: string) => {
	let labelContent = {
		className: '',
		text: ''
	};

	if (type === LABEL_TYPES.NOTICE) {
		labelContent.className = 'infoText__label--notice';
		labelContent.text = 'Hinweis';
	}

	return labelContent;
};

export const InfoText = (props: InfoTextProps) => {
	return (
		<p className={`infoText ${props.className ? props.className : ''}`}>
			{props.labelType && (
				<span
					className={
						'infoText__label ' +
						getLabelContent(props.labelType).className
					}
				>
					{getLabelContent(props.labelType).text}
				</span>
			)}
			<span
				className="infoText__text"
				dangerouslySetInnerHTML={{
					__html: props.text
				}}
			></span>
		</p>
	);
};
