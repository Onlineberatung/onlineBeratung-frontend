import * as React from 'react';
import './tagSelect.styles';

export interface TagItem {
	id: string;
	name: string;
	label: string;
	value: number;
}

export const TagSelect = (props) => {
	return (
		<div className="tagSelect">
			<input
				type="checkbox"
				id={props.id}
				name={props.name}
				value={props.value}
				className="tagSelect__input"
				onClick={props.handleTagSelectClick}
			/>
			<label htmlFor={props.id} className="tagSelect__label">
				{props.label}
			</label>
		</div>
	);
};
