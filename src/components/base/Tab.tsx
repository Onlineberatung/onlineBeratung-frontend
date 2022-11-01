import React, { HTMLAttributes, useEffect } from 'react';
import styled from 'styled-components';

export const SELECT_TAB1 = 'tab1';
export const SELECT_TAB2 = 'tab2';
export const SELECT_TAB3 = 'tab3';
export const SELECT_TAB4 = 'tab4';
export const SELECT_TAB5 = 'tab5';
export const SELECT_TAB6 = 'tab6';

export type SELECTION =
	| typeof SELECT_TAB1
	| typeof SELECT_TAB2
	| typeof SELECT_TAB3
	| typeof SELECT_TAB4
	| typeof SELECT_TAB5
	| typeof SELECT_TAB6;

interface TabProps extends HTMLAttributes<HTMLDivElement> {
	selection?: SELECTION;
	tabPanel1?: string;
	tabPanel2?: string;
	tabPanel3?: string;
	tabPanel4?: string;
	tabPanel5?: string;
	tabPanel6?: string;
}

const StyledTab = styled.div`
	${({ theme }) => `
		font-family: ${theme.font.family_sans_serif ?? 'Roboto, sans-serif'};
		font-size: ${theme.font.size_h5 ?? '16px'};
		font-weight: 600;
		line-height: ${theme.font.line_height_primary ?? '21px'};;
	
		display: flex;
		justify-content: center;

		color: ${theme.color.text_emphasisLow ?? '#000000A6'};

		cursor: pointer;
		
		.active {
			color: ${theme.color.interactive_primary ?? '#CC1E1C'};
			border-bottom: 4px solid ${theme.color.interactive_primary ?? '#CC1E1C'};
		}

		.spacing {
			margin: 0 ${theme.grid.base_four ?? '32px'} 0 0;
		}

		& div {
			padding-bottom: 4px;
			
			&:not(.active) {
				&:hover {
					color: ${theme.color.interactive_hover ?? '#A31816'};
				}
			}
		}
	`}
`;

export const Tab = ({
	selection = SELECT_TAB1,
	tabPanel1,
	tabPanel2,
	tabPanel3,
	tabPanel4,
	tabPanel5,
	tabPanel6,
	className,
	...props
}: TabProps) => {
	useEffect(() => {
		let tabPanels = document.getElementsByClassName('tabPanel');
		for (let i = 0; i < tabPanels.length; i++) {
			if (tabPanels[i].innerHTML.length === 0) {
				tabPanels[i].classList.remove('spacing');
			} else {
				tabPanels[i].classList.add('spacing');
			}
		}
	}, [tabPanel1, tabPanel2, tabPanel3, tabPanel4, tabPanel5, tabPanel6]);

	const setTabPanelActive = (x) => {
		let tabPanels = document.getElementsByClassName('tabPanel');
		tabPanels[x].classList.add('active');
		for (let i = 0; i < tabPanels.length; i++) {
			if (i != x) {
				tabPanels[i].classList.remove('active');
			}
		}
	};

	return (
		<StyledTab type="tab" className={`${className}`} {...props}>
			<div
				className="active tabPanel spacing"
				onClick={() => setTabPanelActive(0)}
			>
				{tabPanel1 && tabPanel1}
			</div>
			<div
				className="tabPanel spacing"
				onClick={() => setTabPanelActive(1)}
			>
				{tabPanel2 && tabPanel2}
			</div>
			<div
				className="tabPanel spacing"
				onClick={() => setTabPanelActive(2)}
			>
				{tabPanel3 && tabPanel3}
			</div>
			<div
				className="tabPanel spacing"
				onClick={() => setTabPanelActive(3)}
			>
				{tabPanel4 && tabPanel4}
			</div>
			<div
				className="tabPanel spacing"
				onClick={() => setTabPanelActive(4)}
			>
				{tabPanel5 && tabPanel5}
			</div>
			<div
				className="tabPanel spacing"
				onClick={() => setTabPanelActive(5)}
			>
				{tabPanel6 && tabPanel6}
			</div>
		</StyledTab>
	);
};
