import * as React from 'react';
import { Chip } from '@mui/material';
import { Link } from 'react-router-dom';

export interface TagProps {
	text: string;
	color: 'yellow' | 'green' | 'red';
	link?: string;
	className?: string;
}

/**
 * MUI-based Tag component using MUI Chip
 * Maintains backward compatibility with original Tag component
 */
export const TagMui = ({ text, color, link, className }: TagProps) => {
	// Map custom colors to MUI color variants
	const getMuiColor = (): 'warning' | 'success' | 'error' | 'default' => {
		switch (color) {
			case 'yellow':
				return 'warning';
			case 'green':
				return 'success';
			case 'red':
				return 'error';
			default:
				return 'default';
		}
	};

	const chipElement = (
		<Chip
			label={text}
			color={getMuiColor()}
			size="small"
			clickable={!!link}
			component={link ? Link : 'span'}
			to={link}
			onClick={(e) => {
				if (link) {
					e.stopPropagation();
				}
			}}
			className={className}
			sx={{
				height: '18px',
				fontSize: '12px',
				borderRadius: '8px',
				letterSpacing: '0.25px',
				'& .MuiChip-label': {
					px: 1,
					py: 0
				},
				...(color === 'red' && {
					backgroundColor: '#ff0000',
					color: 'white',
					'&:hover': {
						backgroundColor: '#cc0000'
					}
				})
			}}
		/>
	);

	return chipElement;
};
