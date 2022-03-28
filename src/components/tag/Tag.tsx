import * as React from 'react';
import './tag.styles';
import { Link } from 'react-router-dom';

export interface TagProps {
	text: string;
	color: 'yellow' | 'green' | 'red';
	link?: string;
	className?: string;
}

const ConditionalWrapper = ({ condition, wrapper, children }) =>
	condition ? wrapper(children) : children;

export const Tag = (props: TagProps) => {
	return (
		<ConditionalWrapper
			condition={props.link}
			wrapper={(children) => (
				<Link
					to={props.link}
					role="button"
					onClick={(e) => e.stopPropagation()}
				>
					{children}
				</Link>
			)}
		>
			<span
				className={`tag tag--${props.color} ${
					props.link ? 'tag--clickable' : ''
				} ${props.className ? props.className : ''}`}
			>
				{props.text}
			</span>
		</ConditionalWrapper>
	);
};
