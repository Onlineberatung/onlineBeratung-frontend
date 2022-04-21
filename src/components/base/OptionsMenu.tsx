import React, { HTMLAttributes, ReactElement } from 'react';
import styled from 'styled-components';

interface OptionsMenuProps extends HTMLAttributes<HTMLDivElement> {
	label1: string;
	label2: string;
	label3: string;
	label4: string;
	icon: ReactElement;
}

const StyledOptionsMenu = styled.div`
	${({ theme }) => `
		z-index: 300;

		font-family: ${theme.font.fontFamily};
		font-weight: ${theme.font.fontWeight};
		font-size: ${theme.font.fontSize};
		line-height: ${theme.font.lineHeight};

		color: ${theme.colors.black};
		background-color: ${theme.colors.white};

		border: ${theme.optionsMenu.border.style};
		border-radius: ${theme.optionsMenu.border.radius};
		border-color: ${theme.colors.grey};
		box-shadow: ${theme.optionsMenu.border.boxShadow} ${theme.colors.shadow};
		box-sizing: ${theme.optionsMenu.border.boxSizing};

		width: ${theme.optionsMenu.width};

		.optionsMenu--container {
			position: relative;
		}
			
		.optionsMenu--listItem {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: ${theme.optionsMenu.padding};
			border-radius: ${theme.optionsMenu.border.radius};

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
			z-index: 301;

			display: none;

			position: absolute;
			left: ${theme.optionsMenu.secondLevel.position.left};
			top: ${theme.optionsMenu.secondLevel.position.top};
			width: ${theme.optionsMenu.width};
		
			border: ${theme.optionsMenu.border.style};
			border-radius: ${theme.optionsMenu.border.radius};
			border-color: ${theme.colors.grey};
			box-sizing: ${theme.optionsMenu.border.boxSizing};
			box-shadow: ${theme.optionsMenu.border.boxShadow} ${theme.colors.shadow};

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
	`}
`;

// We are passing a default theme for Buttons that arent wrapped in the ThemeProvider
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
			fontFamily: 'Roboto, sans-serif',
			fontWeight: '400',
			fontSize: '16px',
			lineHeight: '24px'
		},
		optionsMenu: {
			border: {
				style: '1px solid',
				radius: '4px',
				boxSizing: 'border-box',
				boxShadow: '0px 3px 0px 1px'
			},
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
};

/**
 * Primary UI component for user interaction
 */
export const OptionsMenu = ({
	label1,
	label2,
	label3,
	label4,
	icon,
	className,
	...props
}: OptionsMenuProps) => {
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
		let optionsDefault = document.getElementById('root').children[0];
		let listItems = document.getElementsByClassName(
			'optionsMenu--listItem-firstLevel'
		);
		let secondLevelMenu = document.getElementsByClassName(
			'optionsMenu--listItem-secondLevel'
		);

		if (!optionsDefault.contains(target)) {
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
		>
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
						{label1 && label1}
						{icon && icon}
					</div>

					<div className="optionsMenu--listItem">
						{label2 && label2}
						{icon && icon}
					</div>

					<div className="optionsMenu--listItem">
						{label3 && label3}
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
						{label1 && label1}
						{icon && icon}
					</div>

					<div className="optionsMenu--listItem">
						{label2 && label2}
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
						{label1 && label1}
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
						{label1 && label1}
						{icon && icon}
					</div>
				</div>
			</div>
		</StyledOptionsMenu>
	);
};
