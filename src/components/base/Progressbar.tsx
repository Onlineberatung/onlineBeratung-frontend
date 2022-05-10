import React, { HTMLAttributes, ReactElement } from 'react';
import styled from 'styled-components';

interface ProgressbarProps extends HTMLAttributes<HTMLDivElement> {
	label1?: string;
	icon1?: ReactElement;
	label2?: string;
	icon2?: ReactElement;
	label3?: string;
	icon3?: ReactElement;
	label4?: string;
	icon4?: ReactElement;
}

const StyledProgressbar = styled.div`
	${({ theme }) => `
		font-family: ${theme.font.family};
		font-weight: ${theme.font.weight};
		font-size: ${theme.font.size};
		line-height: ${theme.font.lineHeight};
		letter-spacing: ${theme.font.letterSpacing};
		text-transform: ${theme.font.textTransform};

		display: flex;
		
		.progressbar--progress-container {
			display: flex;
			color: ${theme.colors.grey};

			&:hover {
				color: ${theme.colors.hover};
				.progressbar--progress .progressbar--progress-icon {
					border-color: ${theme.colors.hover};
					path {
						fill: ${theme.colors.hover};
					}
				}
			}

			.progressbar--seperator {
				height: 0px;
				width: ${theme.progressbar.seperator.width};
				margin: calc(${theme.progressbar.iconHeight} / 2) ${theme.progressbar.seperator.spacing} 0 ${theme.progressbar.seperator.spacing};
				border-bottom: ${theme.border.style} ${theme.colors.grey};
			}

			.progressbar--progress {
				display: flex;
				flex-direction: column;	
				align-items: ${theme.progressbar.align};

				.progressbar--progress-icon {
					display: flex;
					justify-content: ${theme.progressbar.align};
					align-items: ${theme.progressbar.align};
					box-sizing: ${theme.progressbar.boxSizing};
					height: ${theme.progressbar.iconHeight};
					width: ${theme.progressbar.iconWidth};
					border-radius: ${theme.border.radius};
					border: ${theme.border.style} ${theme.colors.grey};
					margin-bottom: 8px;
					
					& path {
						height: 21px;
						width: 16px;
						fill: ${theme.colors.grey};
					}
				}
			}  

			&.active {
				color: ${theme.colors.primary};
				.progressbar--progress-icon {
					background-color: ${theme.colors.primary};
					border-color: ${theme.colors.primary};
					path {
						fill: ${theme.colors.white};
					}
				}
				&:hover {
					.progressbar--progress .progressbar--progress-icon {
						color:${theme.colors.primary};
						border-color: ${theme.colors.primary};
						path {
							fill: ${theme.colors.white};
						}
					}
				}
			}

			&.done {
				color: ${theme.colors.primary};
				.progressbar--progress-icon {
					background-color: ${theme.colors.white};
					border-color: ${theme.colors.primary};
					path {
						fill: ${theme.colors.primary};
					}
				}
		
				&:hover {
					.progressbar--progress .progressbar--progress-icon {
						color: ${theme.colors.primary};
						border-color: ${theme.colors.primary};
						path {
							fill:  ${theme.colors.primary};
						}
					}
				}
			}
		}
	`}
`;

StyledProgressbar.defaultProps = {
	theme: {
		colors: {
			grey: '#00000033',
			primary: '#CC1E1C',
			hover: '#A31816',
			white: '#FFFFFF'
		},

		font: {
			family: '"Roboto Slab", serif',
			weight: '500',
			size: '12px',
			lineHeight: '16px',
			letterSpacing: '1.5px',
			textTransform: 'uppercase'
		},

		border: {
			style: '1px solid',
			radius: '50%'
		},

		progressbar: {
			align: 'center',
			iconHeight: '48px',
			iconWidth: '48px',
			boxSizing: 'border-box,',

			seperator: {
				width: '45px',
				spacing: '8.5px'
			}
		}
	}
};

export const Progressbar = ({
	label1,
	icon1,
	label2,
	icon2,
	label3,
	icon3,
	label4,
	icon4,
	className,
	...props
}: ProgressbarProps) => {
	return (
		<StyledProgressbar
			type="progressbar"
			className={`${className}`}
			{...props}
		>
			<style>
				@import
				url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@500&display=swap');
			</style>
			<div className="progressbar--progress-container done">
				<div className="progressbar--progress">
					<div className="progressbar--progress-icon">
						{icon1 && icon1}
					</div>
					{label1 && label1}
				</div>
				<div className="progressbar--seperator"></div>
			</div>

			<div className="progressbar--progress-container done">
				<div className="progressbar--progress">
					<div className="progressbar--progress-icon">
						{icon2 && icon2}
					</div>
					{label2 && label2}
				</div>
				<div className="progressbar--seperator"></div>
			</div>

			<div className="progressbar--progress-container active">
				<div className="progressbar--progress">
					<div className="progressbar--progress-icon">
						{icon3 && icon3}
					</div>
					{label3 && label3}
				</div>
				<div className="progressbar--seperator"></div>
			</div>

			<div className="progressbar--progress-container">
				<div className="progressbar--progress">
					<div className="progressbar--progress-icon">
						{icon4 && icon4}
					</div>
					{label4 && label4}
				</div>
			</div>
		</StyledProgressbar>
	);
};
