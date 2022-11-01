import React, { HTMLAttributes, ReactElement, useEffect, useRef } from 'react';
import styled from 'styled-components';

export const TYPE_1 = 'saveAccount';
export const TYPE_2 = 'dataSecurity';
export const TYPE_3 = 'missedCall';
export const TYPE_4 = 'forwardingSuccess';
export const TYPE_5 = 'forwardingError';
export const TYPE_6 = 'nextSteps';
export const TYPE_7 = 'consulting';
export const TYPE_8 = 'mail';

export type TYPE =
	| typeof TYPE_1
	| typeof TYPE_2
	| typeof TYPE_3
	| typeof TYPE_4
	| typeof TYPE_5
	| typeof TYPE_6
	| typeof TYPE_7
	| typeof TYPE_8;

interface SystemMessageProps extends HTMLAttributes<HTMLAnchorElement> {
	type?: TYPE;
	headline?: string;
	icon?: ReactElement;
	content?: string;
	link?: string;
	nextStepsIcon1?: ReactElement;
	nextStepsIcon2?: ReactElement;
	nextStepsIcon3?: ReactElement;
	nextStepsText1?: string;
	nextStepsText2?: string;
	nextStepsText3?: string;
}

const StyledSystemMessage = styled.div`
	${({ theme }) => `
	font-family: ${theme.font.family_sans_serif ?? 'Roboto, sans-serif'};
    font-size: ${theme.font.size_tertiary ?? '14px'};
    font-weight: 600;
    line-height: ${theme.font.line_height_primary ?? '21px'};

	max-width: 760px;

	color: ${theme.color.text_emphasisLow ?? '#000000A6'};

	display: flex;

	.systemMessage {
		&--icon {
			svg {
				path {
					fill: ${theme.color.interactive_tertiary ?? '#000000A6'};
				}
			}
		}

		&--container {
			margin-left: 19px;

			&-headline {
				margin-bottom: 4px;
			}

			&-content {
				font-weight: ${theme.font.weight_regular ?? '400'};

				.link {
					color: ${theme.color.interactive_primary ?? '#CC1E1C'};
					text-decoration: underline;
					margin-top: ${theme.grid.base ?? '8px'};

					&:hover {
						color: ${theme.color.interactive_hover ?? '#A31816'};
						cursor: pointer;
					}
				}

				.nextSteps {
					&--container {
						min-height: 220px;
						width: 720px;
						padding: ${theme.grid.base_three ?? '24px'} ${theme.grid.base_two ?? '16px'} ${
		theme.grid.base_three ?? '24px'
	} ${theme.grid.base_two ?? '16px'};

						box-sizing: border-box;

						margin-top: 12px;
						
						background-color: ${theme.color.background_neutral3 ?? '#E7E3E1'};
						border-radius: 0px 12px 12px 12px;

						display: none;
						justify-content: space-around;
					}

					&--item {
						display: flex;
						flex-direction: column;
						align-items: center;

						svg {
							height: 120px;
							width: 120px;
						}

						&-text {
							width: 201px;
							height: 40px;
							text-align: center;

							margin-top: 12px;

							color: ${theme.color.text_emphasisHigh ?? '#000000E5'};
						}
					}
			
				}
			}
		}
	}
	`}
`;

export const SystemMessage = ({
	type = TYPE_1,
	icon,
	headline,
	content,
	link,
	nextStepsIcon1,
	nextStepsIcon2,
	nextStepsIcon3,
	nextStepsText1,
	nextStepsText2,
	nextStepsText3,
	className,
	...props
}: SystemMessageProps) => {
	const nextStepsContainer = useRef(null);

	useEffect(() => {
		if (type == TYPE_6) {
			nextStepsContainer.current.style.display = 'flex';
		} else {
			nextStepsContainer.current.style.display = 'none';
		}
	}, [type]);

	return (
		<StyledSystemMessage
			type="div"
			className={`${className} ${type}`}
			{...props}
		>
			<div className="systemMessage--icon">{icon && icon}</div>

			<div className="systemMessage--container">
				<div className="systemMessage--container-headline">
					{headline && headline}
				</div>

				<div className="systemMessage--container-content">
					{content && content}

					<div
						className="nextSteps--container"
						ref={nextStepsContainer}
					>
						<div className="nextSteps--item">
							{nextStepsIcon1 && nextStepsIcon1}
							<div className="nextSteps--item-text">
								{nextStepsText1 && nextStepsText1}
							</div>
						</div>

						<div className="nextSteps--item">
							{nextStepsIcon2 && nextStepsIcon2}
							<div className="nextSteps--item-text">
								{nextStepsText2 && nextStepsText2}
							</div>
						</div>

						<div className="nextSteps--item">
							{nextStepsIcon3 && nextStepsIcon3}
							<div className="nextSteps--item-text">
								{nextStepsText3 && nextStepsText3}
							</div>
						</div>
					</div>

					<div className="link">{link && link}</div>
				</div>
			</div>
		</StyledSystemMessage>
	);
};
