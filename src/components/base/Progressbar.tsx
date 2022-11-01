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
		font-family: ${theme.font.family_divider ?? 'Roboto Slab, serif'};
		font-weight: ${theme.font.weight_medium ?? '500'};
		font-size: ${theme.font.size_secondary ?? '12px'};
		line-height: ${theme.font.line_height_secondary ?? '16px'};
		letter-spacing: 1.5px;
		text-transform: uppercase;

		display: flex;
		
		.progressbar--progress-container {
			display: flex;

			.progressbar--seperator {
				height: 0px;
				width: 45px;
				margin: 24px 8.5px 0 8.5px;
				border-bottom: ${theme.border.style ?? '1px solid'} ${
		theme.color.outline ?? '#00000033'
	};
			}

			.progressbar--progress {
				display: flex;
				flex-direction: column;	
				align-items: center;

				.progressbar--progress-icon {
					display: flex;
					justify-content: center;
					align-items: center;
					box-sizing: border-box;
					height: 48px;
					width: 48px;
					border-radius: 50%;
					border: ${theme.border.style ?? '1px solid'} ${
		theme.color.interactive_secondary ?? '#000000E5'
	};
					margin-bottom: 8px;
					
					& path {
						height: 21px;
						width: 16px;
						fill: ${theme.color.interactive_secondary ?? '#000000E5'};
					}
				}

				&:hover {
					color: ${theme.color.interactive_secondary ?? '#000000E5'};

					cursor: pointer;

					.progressbar--progress-icon {
						background-color: ${theme.color.interactive_secondary ?? '#000000E5'};
						border-color: ${theme.color.interactive_secondary ?? '#000000E5'};
						path {
							fill:  ${theme.color.interactive_onDark ?? '#FFFFFF'};
						}
					}
				}
			}  

			&.active {
				color: ${theme.color.interactive_primary ?? '#CC1E1C'};
				.progressbar--progress-icon {
					background-color: ${theme.color.interactive_primary ?? '#CC1E1C'};
					border-color: ${theme.color.interactive_primary ?? '#CC1E1C'};
					path {
						fill: ${theme.color.interactive_onDark ?? '#FFFFFF'};
					}
				}
			}

			&.done {
				color: ${theme.color.interactive_hover ?? '#A31816'};
				.progressbar--progress-icon {
					background-color: ${theme.color.interactive_onDark ?? '#FFFFFF'};
					border-color: ${theme.color.interactive_hover ?? '#A31816'};
					path {
						fill: ${theme.color.interactive_hover ?? '#A31816'};
					}
				}
			}
		}
	`}
`;

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
