import React, {
	HTMLAttributes,
	ReactElement,
	useEffect,
	useRef,
	useState
} from 'react';
import styled from 'styled-components';

export const STATUS_DEFAULT = 'default';
export const STATUS_ACTIVE = 'active';
export const STATUS_ERROR = 'error';

export type STATUS =
	| typeof STATUS_DEFAULT
	| typeof STATUS_ACTIVE
	| typeof STATUS_ERROR;

interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
	status?: STATUS;
	text?: string;
	helperText?: string;
	disabled?: boolean;
	iconDown?: ReactElement;
	iconUp?: ReactElement;
	iconOptions?: ReactElement;
}

const StyledDropdown = styled.div`
	${({ theme }) => `
		font-family: ${theme.font.family_sans_serif ?? 'Roboto, sans-serif'};
		font-weight: ${theme.font.weight_regular ?? '400'};
		font-size: ${theme.font.size_primary ?? '16px'};
		line-height: ${theme.font.line_height_senary ?? '24px'};
		
		.dropdown--header {
			display: flex;
			justify-content: space-between;
			align-items: center;

			width: 229px;
			height: 48px;
			padding: 12px 14px 12px 16px;

			box-sizing: border-box;
			border: ${theme.border.style ?? '1px solid'} ${
		theme.color.outline ?? '#00000033'
	};
			border-radius: ${theme.border.radius ?? '4px'};

			color: ${theme.color.interactive_secondary ?? '#000000E5'};

			.icon--arrow {
				width: 16px;
				box-sizing: border-box;
				
				svg {
					height: 9.82px;
					width: 16.67px

					path {
						fill: ${theme.color.interactive_tertiary ?? '#000000A6'};
					}
				}
			}

			&:hover {
				border-color: ${theme.color.interactive_secondary ?? '#000000E5'};

				.icon--arrow {
					path {
						fill: ${theme.color.interactive_secondary ?? '#000000E5'};
					}
				}
			}
		}

		&.active {
			.dropdown--header {
				border: ${theme.border.style_bold ?? '2px solid'} ${
		theme.color.interactive_secondary ?? '#000000E5'
	};
				color: ${theme.color.interactive_secondary ?? '#000000E5'};
			}
		}

		&.error {
			.dropdown--header {
				border: ${theme.border.style_bold ?? '2px solid'} ${
		theme.color.status_error_foreground ?? '#FF0000'
	};
				color: ${theme.color.interactive_secondary ?? '#000000E5'};

				&:hover {
					.icon--arrow {
						path {
							fill: ${theme.color.status_error_foreground ?? '#FF0000'};
						}
					}
				}
			}
		}

		&.disabled {
			.dropdown--header {
				
				color: ${theme.color.interactive_tertiary ?? '#000000A6'};
				background-color: ${
					theme.color.interactive_disabled_background_black ??
					'#0000000D'
				};
				border: none;

				.icon--arrow {
					path {
						fill: ${theme.color.outline ?? '#00000033'};
					}
				}

				&:hover {
					.icon--arrow {
						path {
							fill: ${theme.color.outline ?? '#00000033'};
						}
					}
				}
			}
		}	
		
		.selected {
			border: ${theme.border.style_bold ?? '2px solid'} ${
		theme.color.interactive_secondary ?? '#000000E5'
	};
			color: ${theme.color.interactive_secondary ?? '#000000E5'};
		}

		.dropdown--error-helperText {
			font-size: ${theme.font.size_secondary ?? '12px'};
			color: ${theme.color.status_error_foreground ?? '#FF0000'};
			margin: 4px 0 0 18.5px;
		}
		
		.dropdown--option-container {
			position: relative;
			color: ${theme.color.interactive_secondary ?? '#000000E5'};
			background-color: ${theme.color.interactive_onDark ?? '#FFFFFF'};

			border: ${theme.border.style ?? '1px solid'};
			border-radius: ${theme.border.radius ?? '4px'};
			border-color: ${theme.color.outline ?? '#00000033'};
			box-sizing: border-box;

			width: 192px;

			margin: 14px 0 0 20px;

			&:before {
				z-index: 298;
				content: '';
				border: 8px solid;
				border-color: transparent transparent ${
					theme.color.outline ?? '#00000033'
				} transparent;
				position: absolute;
				top: -17px;
				left: 90px;
			}
		}

		.dropdown--options-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 12px 16px 12px 16px;
			border-radius: ${theme.border.radius ?? '4px'};

			path {
				height: 4px;
				width: 16px;
			}

			&:hover {
				background-color: ${theme.color.background_red1 ?? '#F8DEDD'};
				color: ${theme.color.interactive_hover ?? '#A31816'};
				
				path {
					fill: ${theme.color.interactive_hover ?? '#A31816'};
				}
			}	
		}

		.active {
			background-color: ${theme.color.background_red1 ?? '#F8DEDD'};
			color: ${theme.color.interactive_hover ?? '#A31816'};

			path {
				fill: ${theme.color.interactive_hover ?? '#A31816'};
			}
		}

		.dropdown--triangle {
			z-index: 299;
			position: absolute;
			top: -14px;
			left: 91px;
			border: 7px solid;
			border-color: transparent transparent white transparent;
		}	
	`}
`;

export const Dropdown = ({
	status = STATUS_DEFAULT,
	text,
	helperText,
	disabled = false,
	className,
	iconDown,
	iconUp,
	iconOptions,
	...props
}: DropdownProps) => {
	let optionContainerRef = useRef(null);
	let arrowDownRef = useRef(null);
	let arrowUpRef = useRef(null);
	let selectContainerRef = useRef(null);
	let helperTextRef = useRef(null);

	const [isExpanded, setIsExpanded] = useState(false);
	const [isSelected, setIsSelected] = useState(false);

	let handleExpandCollapse = () => {
		setIsExpanded(!isExpanded);
		let listItems = document.getElementsByClassName(
			'dropdown--options-item'
		);
		for (let i = 0; i < listItems.length; i++) {
			listItems[i].classList.remove('active');
		}
	};

	useEffect(() => {
		if (!disabled) {
			if (isExpanded) {
				optionContainerRef.current.style.display = 'block';
				arrowDownRef.current.style.display = 'none';
				arrowUpRef.current.style.display = 'block';
				setIsSelected(true);
			} else {
				optionContainerRef.current.style.display = 'none';
				arrowDownRef.current.style.display = 'block';
				arrowUpRef.current.style.display = 'none';
				setIsSelected(false);
			}
		}
	}, [isExpanded]);

	useEffect(() => {
		isSelected
			? selectContainerRef.current.classList.add('selected')
			: selectContainerRef.current.classList.remove('selected');
	}, [isSelected]);

	useEffect(() => {
		if (!disabled) {
			status == 'error'
				? (helperTextRef.current.style.display = 'block')
				: (helperTextRef.current.style.display = 'none');
		}
	}, [status]);

	useEffect(() => {
		if (disabled == false && status == 'error') {
			helperTextRef.current.style.display = 'block';
		} else {
			helperTextRef.current.style.display = 'none';
			setIsExpanded(false);
			optionContainerRef.current.style.display = 'none';
			arrowDownRef.current.style.display = 'block';
			arrowUpRef.current.style.display = 'none';
		}
	}, [disabled]);

	const setListItemActive = (x) => {
		let listItems = document.getElementsByClassName(
			'dropdown--options-item'
		);
		listItems[x].classList.add('active');
		for (let i = 0; i < listItems.length; i++) {
			if (i != x) {
				listItems[i].classList.remove('active');
			}
		}
	};

	return (
		<StyledDropdown
			type="dropdown"
			className={`${className} ${status && status} ${
				disabled && 'disabled'
			}`}
			{...props}
		>
			<div
				className="dropdown--header"
				ref={selectContainerRef}
				onClick={() => handleExpandCollapse()}
			>
				{text && text}
				<span
					className="icon--arrow icon--arrow-down"
					ref={arrowDownRef}
				>
					{iconDown && iconDown}
				</span>
				<span className="icon--arrow icon--arrow-up" ref={arrowUpRef}>
					{iconUp && iconUp}
				</span>
			</div>
			<span className="dropdown--error-helperText" ref={helperTextRef}>
				{helperText && helperText}
			</span>
			<div
				className="dropdown--option-container"
				ref={optionContainerRef}
			>
				<span className="dropdown--triangle"></span>
				<div onClick={() => setListItemActive(0)}>
					<div className="dropdown--options-item">
						Label 1{iconOptions && iconOptions}
					</div>
				</div>

				<div onClick={() => setListItemActive(1)}>
					<div className="dropdown--options-item">
						Label 2{iconOptions && iconOptions}
					</div>
				</div>

				<div onClick={() => setListItemActive(2)}>
					<div className="dropdown--options-item">
						Label 3{iconOptions && iconOptions}
					</div>
				</div>

				<div onClick={() => setListItemActive(3)}>
					<div className="dropdown--options-item">
						Label 4{iconOptions && iconOptions}
					</div>
				</div>
			</div>
		</StyledDropdown>
	);
};
