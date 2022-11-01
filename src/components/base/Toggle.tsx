import React, { HTMLAttributes, useState } from 'react';
import styled from 'styled-components';
import Switch from 'react-switch';

interface ToggleProps extends HTMLAttributes<HTMLSpanElement> {
	label?: string;
}

const StyledToggle = styled.span`
	${({ theme }) => `
		font-family: ${theme.font.family_sans_serif ?? 'Roboto, sans-serif'};
		font-weight: ${theme.font.weight_regular ?? '400'};
		font-size: ${theme.font.size_h5 ?? '16px'};
		line-height: ${theme.font.line_height_primary ?? '21px'};

		.toggle {
			margin: 0 12px 0 0;

			&--container {
				display: flex;
				align-items: center;
				color: #3F373F;
			}
		}
	`}
`;

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
					onColor="#0A882F"
					offColor="#a0a0a0"
					boxShadow="0px 1px 0px 0px rgba(0, 0, 0, 0.1)"
					handleDiameter={20}
					activeBoxShadow="none"
				/>
				{label && label}
			</label>
		</StyledToggle>
	);
};
