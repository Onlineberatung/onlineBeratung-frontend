import * as React from 'react';
import { Typography } from '@mui/material';

export type HeadlineLevel = '1' | '2' | '3' | '4' | '5';

interface HeadlineMuiProps {
	text: string;
	semanticLevel: HeadlineLevel;
	styleLevel?: HeadlineLevel;
	className?: string;
}

/**
 * MUI-based Headline component using MUI Typography
 * Maintains backward compatibility with original Headline component
 * - semanticLevel determines the HTML element (h1-h5)
 * - styleLevel determines the visual styling
 */
export const HeadlineMui = ({
	text,
	semanticLevel,
	styleLevel,
	className
}: HeadlineMuiProps) => {
	// Map level to MUI Typography variant
	const getVariant = (
		level: HeadlineLevel
	): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' => {
		return `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
	};

	// Use styleLevel for visual appearance, semanticLevel for HTML tag
	const variant = getVariant(styleLevel || semanticLevel);
	const component = getVariant(semanticLevel);

	return (
		<Typography
			variant={variant}
			component={component}
			className={className}
			dangerouslySetInnerHTML={{ __html: text }}
			sx={{
				m: 0,
				p: 0,
				fontFamily: 'inherit',
				...(variant === 'h1' && {
					mb: 5
				}),
				...(variant === 'h2' && {
					mb: 3
				})
			}}
		/>
	);
};
