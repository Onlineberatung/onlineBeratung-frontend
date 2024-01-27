import * as React from 'react';
import { useTranslation } from 'react-i18next';
import './text.styles';

export type TextTypeOptions =
	| 'standard'
	| 'infoLargeStandard'
	| 'infoLargeAlternative'
	| 'infoMedium'
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

export const Text = (props: TextProps) => {
	const { t: translate } = useTranslation();

	const getLabelContent = (type: string) => {
		let labelContent = {
			className: '',
			text: ''
		};

		if (type === LABEL_TYPES.NOTICE) {
			labelContent.className = 'text__label--notice';
			labelContent.text = translate('text.label.hint');
		}

		return labelContent;
	};

	// Do not render text component if content is empty
	if (!props.title && !props.text) return null;

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
