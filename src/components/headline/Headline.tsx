import * as React from 'react';
import './headline.styles';

interface HeadlineProps {
	semanticLevel: '1' | '2' | '3' | '4' | '5' | '6';
	styleLevel?: 'super' | '1' | '2' | '3' | '4' | '5';
	text: string;
}

export const Headline = (props: HeadlineProps) => {
	const Tag = ('h' + props.semanticLevel) as keyof JSX.IntrinsicElements;
	const levelBasedClass = props.styleLevel
		? props.styleLevel
		: props.semanticLevel;

	return (
		<Tag className={`headline headline--${levelBasedClass}`}>
			{props.text}
		</Tag>
	);
};
