import * as React from 'react';
import { VFC } from 'react';
import { Box, Typography } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

export const PreselectionError: VFC<{
	errorMessage: string;
}> = ({ errorMessage }) => {
	return (
		<Box
			sx={{
				backgroundColor: 'rgba(255, 255, 255, 0.40)',
				p: '16px',
				mt: '4px'
			}}
		>
			<Typography sx={{ color: 'white' }}>
				<ReportProblemIcon
					aria-hidden="true"
					color="inherit"
					sx={{
						width: '20px',
						height: '20px',
						mr: '8px'
					}}
				/>
				{errorMessage}
			</Typography>
		</Box>
	);
};
