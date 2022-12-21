import * as React from 'react';
import { Button } from '../button/Button';
import './listInfo.styles';
import { Text } from '../text/Text';

interface ListInfoProps {
	onButtonClick?: () => void;
	buttonLabel?: string;
	description?: string;
	headline: string;
	Illustration?: React.FunctionComponent<
		React.SVGProps<SVGSVGElement> & {
			title?: string;
		}
	>;
}

export const ListInfo: React.FC<ListInfoProps> = ({
	onButtonClick,
	buttonLabel,
	description,
	headline,
	Illustration
}) => {
	return (
		<div className="listInfo">
			{Illustration && (
				<div className="listInfo__illustration">
					<Illustration
						title=""
						aria-hidden="true"
						focusable="false"
						height="100%"
						width="100%"
					/>
				</div>
			)}
			<h5>{headline}</h5>
			{description && <Text type="standard" text={description}></Text>}
			{onButtonClick && buttonLabel && (
				<Button
					item={{
						label: buttonLabel,
						title: buttonLabel,
						type: 'PRIMARY'
					}}
					buttonHandle={onButtonClick}
				/>
			)}
		</div>
	);
};
