import * as React from 'react';

export interface IframeProps {
	link: string;
	id: string;
	onLoad?: () => void;
}

export const Iframe = (props: IframeProps) => {
	return (
		<iframe
			id={props.id}
			title={props.id}
			src={props.link}
			style={{ display: 'none' }}
			onLoad={props.onLoad}
		/>
	);
};
