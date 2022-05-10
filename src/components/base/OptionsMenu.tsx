import React, { HTMLAttributes, ReactElement, useRef } from 'react';
import styled from 'styled-components';

interface OptionsMenuProps extends HTMLAttributes<HTMLDivElement> {
	label1?: string;
	label11?: string;
	label12?: string;
	label13?: string;
	label2?: string;
	label21?: string;
	label22?: string;
	label3?: string;
	label31?: string;
	label4?: string;
	label41?: string;
	icon: ReactElement;
}

const StyledOptionsMenu = styled.div`
	${({ theme }) => `
		font-family: ${theme.font.family};
		font-weight: ${theme.font.weight};
		font-size: ${theme.font.size};
		line-height: ${theme.font.lineHeight};

		position: relative;
		width: ${theme.optionsMenu.width};
		
		border: ${theme.border.style};
		border-radius: ${theme.border.radius};
		border-color: ${theme.colors.grey};
		box-shadow: ${theme.border.boxShadow} ${theme.colors.shadow};
		box-sizing: ${theme.border.boxSizing};

		color: ${theme.colors.black};
		background-color: ${theme.colors.white};

		.optionsMenu--container {
			position: relative;
		}
			
		.optionsMenu--listItem {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: ${theme.optionsMenu.padding};
			border-radius: ${theme.border.radius};

			path {
				height: ${theme.optionsMenu.icon.height};
				width: ${theme.optionsMenu.icon.width};
			}

			&:hover {
				background-color: ${theme.colors.backgroundRed};
				color: ${theme.colors.red};
				
				path {
					fill: ${theme.colors.red};
				}
			}	
		}

		.optionsMenu--listItem-secondLevel {
			z-index: 302;

			display: none;

			position: absolute;
			left: ${theme.optionsMenu.secondLevel.position.left};
			top: ${theme.optionsMenu.secondLevel.position.top};
			width: ${theme.optionsMenu.width};
		
			border: ${theme.border.style};
			border-radius: ${theme.border.radius};
			border-color: ${theme.colors.grey};
			box-sizing: ${theme.border.boxSizing};
			box-shadow: ${theme.border.boxShadow} ${theme.colors.shadow};

			background-color: ${theme.colors.white};
				
			:hover {
				cursor: pointer;
			}
		}

		.active {
			background-color: ${theme.colors.backgroundRed};
			color: ${theme.colors.red};

			path {
				fill: ${theme.colors.red};
			}
		}

		.visible {
			display: block;
		}

		&:before {
			z-index: 298;
			content: '';
			border: 8px solid;
			border-color: transparent transparent ${theme.colors.grey}; transparent;
			position: absolute;
			top: -17px;
			left: 90px;
		}

		.optionsMenu--triangle {
			z-index: 299;
			position: absolute;
			top: -14px;
			left: 91px;
			border: 7px solid;
			border-color: transparent transparent white transparent;
		}	
	`}
`;

StyledOptionsMenu.defaultProps = {
	theme: {
		colors: {
			white: '#FFFFFF',
			black: '#000000DE',
			grey: '#00000033',
			backgroundRed: '#F8DEDD',
			red: '#A31816',
			shadow: '0000001A'
		},

		font: {
			family: 'Roboto, sans-serif',
			weight: '400',
			size: '16px',
			lineHeight: '24px'
		},

		border: {
			style: '1px solid',
			radius: '4px',
			boxSizing: 'border-box',
			boxShadow: '0px 3px 0px 1px'
		},

		optionsMenu: {
			width: '192px',
			padding: '12px 16px 12px 16px',

			icon: {
				height: '4px',
				width: '16px'
			},

			secondLevel: {
				position: {
					left: '154px',
					top: '36px'
				}
			}
		}
	}
};

export const OptionsMenu = ({
	label1,
	label11,
	label12,
	label13,
	label2,
	label21,
	label22,
	label3,
	label31,
	label4,
	label41,
	icon,
	className,
	...props
}: OptionsMenuProps) => {
	const optionsMenuRef = useRef(null);

	const setListItemActive = (x) => {
		let listItems = document.getElementsByClassName(
			'optionsMenu--listItem-firstLevel'
		);
		let secondLevelMenu = document.getElementsByClassName(
			'optionsMenu--listItem-secondLevel'
		);
		listItems[x].classList.add('active');
		secondLevelMenu[x].classList.add('visible');
		for (let i = 0; i < listItems.length; i++) {
			if (i != x) {
				listItems[i].classList.remove('active');
				secondLevelMenu[i].classList.remove('visible');
			}
		}
	};

	window.addEventListener('click', function (e) {
		const target = e.target as Element;
		let listItems = document.getElementsByClassName(
			'optionsMenu--listItem-firstLevel'
		);
		let secondLevelMenu = document.getElementsByClassName(
			'optionsMenu--listItem-secondLevel'
		);
		if (optionsMenuRef.current.contains(target) == false) {
			for (let i = 0; i < listItems.length; i++) {
				listItems[i].classList.remove('active');
				secondLevelMenu[i].classList.remove('visible');
			}
		}
	});

	return (
		<StyledOptionsMenu
			type="optionsMenu"
			className={`${className}`}
			{...props}
			ref={optionsMenuRef}
		>
			<span className="optionsMenu--triangle"></span>
			<div
				onClick={() => setListItemActive(0)}
				className="optionsMenu--container"
			>
				<div className="optionsMenu--listItem optionsMenu--listItem-firstLevel">
					{label1 && label1}
					{icon && icon}
				</div>

				<div className="optionsMenu--listItem-secondLevel">
					<div className="optionsMenu--listItem">
						{label11 && label11}
						{icon && icon}
					</div>

					<div className="optionsMenu--listItem">
						{label12 && label12}
						{icon && icon}
					</div>

					<div className="optionsMenu--listItem">
						{label13 && label13}
						{icon && icon}
					</div>
				</div>
			</div>

			<div
				onClick={() => setListItemActive(1)}
				className="optionsMenu--container"
			>
				<div className="optionsMenu--listItem optionsMenu--listItem-firstLevel">
					{label2 && label2}
					{icon && icon}
				</div>

				<div className="optionsMenu--listItem-secondLevel">
					<div className="optionsMenu--listItem">
						{label21 && label21}
						{icon && icon}
					</div>

					<div className="optionsMenu--listItem">
						{label22 && label22}
						{icon && icon}
					</div>
				</div>
			</div>

			<div
				onClick={() => setListItemActive(2)}
				className="optionsMenu--container"
			>
				<div className="optionsMenu--listItem optionsMenu--listItem-firstLevel">
					{label3 && label3}
					{icon && icon}
				</div>

				<div className="optionsMenu--listItem-secondLevel">
					<div className="optionsMenu--listItem">
						{label31 && label31}
						{icon && icon}
					</div>
				</div>
			</div>

			<div
				onClick={() => setListItemActive(3)}
				className="optionsMenu--container"
			>
				<div className="optionsMenu--listItem optionsMenu--listItem-firstLevel">
					{label4 && label4}
					{icon && icon}
				</div>

				<div className="optionsMenu--listItem-secondLevel">
					<div className="optionsMenu--listItem">
						{label41 && label41}
						{icon && icon}
					</div>
				</div>
			</div>
		</StyledOptionsMenu>
	);
};
