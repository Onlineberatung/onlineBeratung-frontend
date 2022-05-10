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
		font-family: ${theme.font.family};
		font-size: ${theme.font.size};
		font-weight: ${theme.font.weight};
		line-height: ${theme.font.lineHeight};
		
		.dropdown--header {
			display: flex;
			justify-content:space-between;
			align-items: center;

			width: ${theme.dropdown.width};
			height: ${theme.dropdown.height};
			padding: ${theme.dropdown.padding};

			box-sizing: border-box;
			border: ${theme.border.style} ${theme.colors.default};
			border-radius: ${theme.border.radius};

			box-shadow: ${theme.dropdown.boxShadow};

			color: ${theme.colors.default};

			.icon--arrow {
				height: ${theme.dropdown.icon.height};
				width: ${theme.dropdown.icon.width};
				box-sizing: border-box;
				
				svg {
					height: ${theme.dropdown.icon.path.height};
					width: ${theme.dropdown.icon.path.width};

					path {
						fill: #000000DE;
					}
				}
			}

			&:hover {
				border-color: ${theme.colors.black};

				.icon--arrow {
					path {
						fill: ${theme.colors.hover};
					}
				}
			}
		}

		&.active {
			.dropdown--header {
				box-shadow: ${theme.dropdown.boxShadowBold};
				border: ${theme.border.style} ${theme.colors.black};
				color: ${theme.colors.black};
			}
		}

		&.error {
			.dropdown--header {
				box-shadow: ${theme.dropdown.boxShadowBold};
				border: ${theme.border.styleBold} #FF0000;
				color: ${theme.colors.black};

				&:hover {
					.icon--arrow {
						path {
							fill: ${theme.colors.error};
						}
					}
				}
			}
		}

		&.disabled {
			.dropdown--header {
				border: ${theme.border.style}; #00000033;
				color: #00000033;
				box-shadow: none;

				&:hover {
					.icon--arrow {
						path {
							fill: ${theme.colors.black};
						}
					}
				}
			}
		}	
		
		.selected {
			border: ${theme.border.styleBold}; ${theme.colors.black};
			color: ${theme.colors.black};
			box-shadow: ${theme.dropdown.boxShadowBold};
		}

		.dropdown--error-helperText {
			font-size: ${theme.font.sizeSmall};
			color: ${theme.colors.error};
			margin: ${theme.dropdown.helperText.margin};
		}
		
		.dropdown--option-container {
			position: relative;
			color: ${theme.colors.black};
			background-color: ${theme.colors.white};

			border: ${theme.border.style};
			border-radius: ${theme.border.radius};
			border-color: ${theme.colors.grey};
			box-shadow: ${theme.dropdown.boxShadowOption} ${theme.colors.shadow};
			box-sizing: border-box;

			width: ${theme.dropdown.options.width};

			margin: 14px 0 0 20px;

			&:before {
				z-index: 298;
				content: '';
				border: 8px solid;
				border-color: transparent transparent ${theme.colors.grey}; transparent;
				position: absolute;
				top: -17px;
				left: 90px;
			}
		}

		.dropdown--options-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: ${theme.dropdown.options.padding};
			border-radius: ${theme.border.radius};

			path {
				height: ${theme.dropdown.options.icon.height};
				width: ${theme.dropdown.options.icon.width};
			}

			&:hover {
				background-color: ${theme.colors.backgroundRed};
				color: ${theme.colors.hover};
				
				path {
					fill: ${theme.colors.hover};
				}
			}	
		}

		.active {
			background-color: ${theme.colors.backgroundRed};
			color: ${theme.colors.hover};

			path {
				fill: ${theme.colors.hover};
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

StyledDropdown.defaultProps = {
	theme: {
		colors: {
			black: '#000000DE',
			default: '#00000066',
			underline: '#00000033',
			error: '#FF0000',
			title: '#00000099',
			hover: '#A31816',

			grey: '#00000033',
			backgroundRed: '#F8DEDD',
			shadow: '0000001A'
		},

		font: {
			family: 'Roboto, sans-serif',
			weight: '400',
			size: '16px',
			sizeSmall: '12px',
			lineHeight: '150%',
			lineHeightSmall: '133%'
		},

		border: {
			style: '1px solid',
			styleBold: '2px solid',
			radius: '4px'
		},

		dropdown: {
			width: '229px',
			height: '48px',
			padding: '12px 14px 12px 16px',

			boxShadow: '0px 2px 0px 1px #0000001A inset',
			boxShadowBold: '0px 2px 0px 1px #0000001A inset',
			boxShadowOption: '0px 3px 0px 1px',

			icon: {
				height: '20px',
				width: '20px',

				path: {
					height: '9.82px',
					width: '16.67px'
				}
			},

			helperText: {
				margin: '4px 0 0 18.5px'
			},

			options: {
				icon: {
					height: '4px',
					width: '16px'
				},
				secondLevel: {
					position: {
						left: '154px',
						top: '36px'
					}
				},
				width: '192px',
				padding: '12px 16px 12px 16px'
			}
		}
	}
};

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
