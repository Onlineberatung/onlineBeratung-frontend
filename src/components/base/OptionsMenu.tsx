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
		font-family: ${theme.font.family_sans_serif ?? 'Roboto, sans-serif'};
		font-weight: ${theme.font.weight_regular ?? '400'};
		font-size: ${theme.font.size_primary ?? '16px'};
		line-height: ${theme.font.line_height_senary ?? '24px'};

		position: relative;
		width: 192px;
		
		box-sizing: border-box;
		box-shadow: 0px 0px 10px 0px ${theme.color.outline ?? '#00000033'};


		color: ${theme.color.text_emphasisHigh ?? '#000000E5'};;
		background-color: ${theme.color.interactive_onDark ?? '#FFFFFF'};;

		.optionsMenu--container {
			position: relative;
		}
			
		.optionsMenu--listItem {
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

		.optionsMenu--listItem-secondLevel {
			z-index: 302;

			display: none;

			position: absolute;
			left: 154px;
			top: 36px;
			width: 192px;
		
			box-shadow: 0px 0px 10px 0px ${theme.color.outline ?? '#00000033'};
			box-sizing: border-box;
			border-radius: ${theme.border.radius ?? '4px'};

			background-color: ${theme.color.interactive_onDark ?? '#FFFFFF'};;
				
			:hover {
				cursor: pointer;
			}
		}

		.active {
			background-color: ${theme.color.background_red1 ?? '#F8DEDD'};
			color: ${theme.color.interactive_hover ?? '#A31816'};

			path {
				fill: ${theme.color.interactive_hover ?? '#A31816'};
			}
		}

		.visible {
			display: block;
		}

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
					</div>

					<div className="optionsMenu--listItem">
						{label12 && label12}
					</div>

					<div className="optionsMenu--listItem">
						{label13 && label13}
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
					</div>

					<div className="optionsMenu--listItem">
						{label22 && label22}
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
					</div>
				</div>
			</div>
		</StyledOptionsMenu>
	);
};
