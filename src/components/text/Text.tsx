import * as React from 'react';
import './text.styles';

export type TextTypeOptions =
	| 'standard'
	| 'infoLargeStandard'
	| 'infoLargeAlternative'
	| 'infoSmall'
	| 'divider';

export interface TextProps {
	text: string;
	title?: boolean;
	labelType?: LABEL_TYPES;
	className?: string;
	type: TextTypeOptions;
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
		labelContent.className = 'text__label--notice';
		labelContent.text = 'Hinweis';
	}

	return labelContent;
};

export const Text = (props: TextProps) => {
	return (
		<p
			className={`text text__${props.type} ${
				props.className ? props.className : ''
			}`}
		>
			{props.labelType && (
				<span
					className={
						'text__label ' +
						getLabelContent(props.labelType).className
					}
				>
					{getLabelContent(props.labelType).text}
				</span>
			)}
			<span
				title={props.title && props.text}
				dangerouslySetInnerHTML={{
					__html: props.text
				}}
			></span>
		</p>
	);
};
