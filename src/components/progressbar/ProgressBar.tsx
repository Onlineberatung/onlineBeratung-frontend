import * as React from 'react';
import './progressbar.styles.scss';

export const ProgressBar = ({
	max,
	current,
	finish = false,
	showPercent = false
}: {
	max: number;
	current: number;
	finish?: boolean;
	showPercent?: boolean;
}) => {
	const percent = Math.round((100 / max) * current);
	return (
		<div
			className={`progressbar progressbar--${
				finish ? 'finish' : 'progress'
			}`}
		>
			<div
				className="progressbar__progress"
				style={{ width: `${finish ? 100 : percent}%` }}
			></div>

			{showPercent && (
				<div className="progressbar__percent">
					{finish ? 100 : percent} %
				</div>
			)}
		</div>
	);
};
