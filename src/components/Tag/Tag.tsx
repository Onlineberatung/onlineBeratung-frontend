import * as React from 'react';
import './tag.styles';

export interface TagProps {
	text: string;
	color: 'yellow' | 'green';
	link?: string;
}

const ConditionalWrapper = ({ condition, wrapper, children }) =>
	condition ? wrapper(children) : children;

export const Tag = (props: TagProps) => {
	return (
		<ConditionalWrapper
			condition={props.link}
			wrapper={(children) => (
				<a href={props.link} role="button">
					{children}
				</a>
			)}
		>
			<span
				className={`tag tag--${props.color} ${
					props.link ? 'tag--clickable' : ''
				}`}
			>
				{props.text}
			</span>
		</ConditionalWrapper>
	);
};
