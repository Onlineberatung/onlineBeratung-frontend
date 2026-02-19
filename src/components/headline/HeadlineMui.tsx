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

	// Get original font sizes and line heights from custom component
	const getFontStyles = (level: HeadlineLevel) => {
		switch (level) {
			case '1':
				return { fontSize: '40px', lineHeight: '50px' };
			case '2':
				return { fontSize: '30px', lineHeight: '38px' };
			case '3':
				return { fontSize: '24px', lineHeight: '32px' };
			case '4':
				return { fontSize: '20px', lineHeight: '26px' };
			case '5':
				return { fontSize: '16px', lineHeight: '21px' };
			default:
				return { fontSize: '16px', lineHeight: '21px' };
		}
	};

	// Use styleLevel for visual appearance, semanticLevel for HTML tag
	const variant = getVariant(styleLevel || semanticLevel);
	const component = getVariant(semanticLevel);
	const fontStyles = getFontStyles(styleLevel || semanticLevel);

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
				fontSize: fontStyles.fontSize,
				lineHeight: fontStyles.lineHeight,
				fontWeight: 700, // $font-weight-bold from settings.scss
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
