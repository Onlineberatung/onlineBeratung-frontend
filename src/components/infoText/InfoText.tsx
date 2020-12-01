import * as React from 'react';
import './infoText.styles';

export interface InfoTextProps {
	text: String;
	labelType?: LABEL_TYPES;
	className?: String;
}

export enum LABEL_TYPES {
	CAUTION = 'CAUTION'
}

const getLabelContent = (type: string) => {
	let labelContent = {
		className: '',
		text: ''
	};

	if (type === LABEL_TYPES.CAUTION) {
		labelContent.className = 'infoText__label--caution';
		labelContent.text = 'Achtung';
	}

	return labelContent;
};

export const InfoText = (props: InfoTextProps) => {
	return (
		<div className={'infoText ' + props.className}>
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
			{props.text}
		</div>
	);
};
