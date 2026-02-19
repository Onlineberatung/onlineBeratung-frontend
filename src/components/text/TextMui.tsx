import * as React from 'react';
import { PropsWithChildren } from 'react';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

export type TextTypeOptions =
	| 'standard'
	| 'infoLargeStandard'
	| 'infoLargeAlternative'
	| 'infoMedium'
	| 'infoSmall'
	| 'divider';

export interface TextProps {
	text?: string;
	title?: boolean;
	labelType?: LABEL_TYPES;
	className?: string;
	type: TextTypeOptions;
}

export enum LABEL_TYPES {
	NOTICE = 'NOTICE'
}

/**
 * MUI-based Text component using MUI Typography
 * Maintains backward compatibility with original Text component
 */
export const TextMui = (props: PropsWithChildren<TextProps>) => {
	const { t: translate } = useTranslation();

	// Map text type to MUI Typography variant
	const getVariant = (): 'body1' | 'body2' | 'caption' => {
		switch (props.type) {
			case 'standard':
			case 'infoLargeStandard':
			case 'infoMedium':
				return 'body1';
			case 'infoLargeAlternative':
				return 'body2';
			case 'infoSmall':
			case 'divider':
				return 'caption';
			default:
				return 'body1';
		}
	};

	// Get color based on type
	const getColor = (): string => {
		switch (props.type) {
			case 'standard':
			case 'infoLargeStandard':
				return 'text.primary';
			case 'infoLargeAlternative':
			case 'infoSmall':
			case 'infoMedium':
				return 'text.secondary';
			case 'divider':
				return 'var(--skin-color-secondary-contrast-safe, rgba(0, 0, 0, 0.6))';
			default:
				return 'text.primary';
		}
	};

	// Get additional styles for specific types
	const getTypeStyles = () => {
		switch (props.type) {
			case 'divider':
				return {
					fontWeight: 600,
					textTransform: 'uppercase' as const,
					letterSpacing: '0.5px'
				};
			default:
				return {};
		}
	};

	const getLabelContent = (type: string) => {
		if (type === LABEL_TYPES.NOTICE) {
			return {
				text: translate('text.label.hint')
			};
		}
		return { text: '' };
	};

	// Do not render text component if content is empty
	if (!props.title && !props.text && !props.children) return null;

	return (
		<Typography
			variant={getVariant()}
			component="p"
			className={props.className}
			sx={{
				textAlign: 'left',
				m: 0,
				color: getColor(),
				...getTypeStyles(),
				'& ul': {
					m: '8px 0 12px 0',
					pl: '20px',
					'& li:not(:first-of-type)': {
						mt: 1
					}
				}
			}}
		>
			{props.labelType && (
				<Box
					component="span"
					sx={{
						fontWeight: 600,
						mr: 0.5,
						color:
							props.labelType === LABEL_TYPES.NOTICE
								? 'var(--skin-color-primary-contrast-safe, primary.main)'
								: 'inherit',
						'&:after': {
							content: '":"',
							display: 'inline-block'
						}
					}}
				>
					{getLabelContent(props.labelType).text}
				</Box>
			)}
			<Box
				component="span"
				title={props.title ? props.text : undefined}
				dangerouslySetInnerHTML={
					props.text
						? {
								__html: props.text
						  }
						: undefined
				}
			>
				{!props.text ? props.children : null}
			</Box>
		</Typography>
	);
};
