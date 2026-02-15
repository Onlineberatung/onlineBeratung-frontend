import * as React from 'react';
import { LinearProgress } from '@mui/material';
import './progressBarMui.styles.scss';

export const ProgressBarMui = ({
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
	const value = finish ? 100 : percent;

	return (
		<div className={`progressbar-mui progressbar-mui--${finish ? 'finish' : 'progress'}`}>
			<LinearProgress
				variant="determinate"
				value={value}
				className="progressbar-mui__progress"
			/>
			{showPercent && (
				<div className="progressbar-mui__percent">
					{value} %
				</div>
			)}
		</div>
	);
};
