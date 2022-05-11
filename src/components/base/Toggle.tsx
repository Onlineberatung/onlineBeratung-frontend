import React, { HTMLAttributes, useState } from 'react';
import styled from 'styled-components';
import Switch from 'react-switch';

interface ToggleProps extends HTMLAttributes<HTMLSpanElement> {
	label?: string;
}

const StyledToggle = styled.span`
	${({ theme }) => `
		font-family: ${theme.font.family};
		font-weight: ${theme.font.weight};
		font-size: ${theme.font.size};
		line-height: ${theme.font.lineHeight};

		.toggle {
			margin: ${theme.toggle.margin};

			&--container {
				display: flex;
				align-items: center;
				color: ${theme.colors.font}
			}
		}
	`}
`;

StyledToggle.defaultProps = {
	theme: {
		colors: {
			font: '#3F373F'
		},

		font: {
			family: 'Roboto, sans-serif',
			weight: '400',
			size: '16px',
			lineHeight: '131%'
		},

		toggle: {
			margin: '0 12px 0 0'
		}
	}
};

export const Toggle = ({ label, className, ...props }: ToggleProps) => {
	const [isSwitchChecked, setIsSwitchChecked] = useState<boolean>(false);

	const handleSwitchChange = () => {
		isSwitchChecked ? setIsSwitchChecked(false) : setIsSwitchChecked(true);
	};

	return (
		<StyledToggle type="toggle" className={`${className}`} {...props}>
			<label className="toggle--container">
				<Switch
					className="toggle"
					onChange={handleSwitchChange}
					checked={isSwitchChecked}
					uncheckedIcon={false}
					checkedIcon={false}
					width={47}
					height={24}
					onColor="#4FCC5C"
					offColor="#dfdfdf"
					boxShadow="0px 1px 0px 0px rgba(0, 0, 0, 0.1)"
					handleDiameter={27}
					activeBoxShadow="none"
				/>
				{label && label}
			</label>
		</StyledToggle>
	);
};
