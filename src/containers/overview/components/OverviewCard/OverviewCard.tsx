import React, { useMemo } from 'react';
import { history } from '../../../../components/app/app';
import { Button, BUTTON_TYPES } from '../../../../components/button/Button';
import { Card } from '../../../../components/card';
import { LoadingIndicator } from '../../../../components/loadingIndicator/LoadingIndicator';
import { translate } from '../../../../utils/translate';
import './overviewCard.styles.scss';

interface OverviewCardProps {
	allMessagesPaths: string;
	emptyMessage: string;
	title: string;
	children: React.ReactNode;
	isLoading: boolean;
	dataListLength: number;
	className: string;
}

const MAX_COUNT = 9;

export const OverviewCard = ({
	className,
	allMessagesPaths,
	title,
	children,
	isLoading,
	dataListLength
}: OverviewCardProps) => {
	const countStr = useMemo(
		() => (dataListLength > MAX_COUNT ? `${MAX_COUNT}+` : dataListLength),
		[dataListLength]
	);

	return (
		<Card className={`overviewCard ${className}`}>
			<Card.Header>
				<h3>{countStr}</h3>

				{translate(title)}
			</Card.Header>
			<Card.Content className={isLoading ? 'loadingCard' : ''}>
				{!isLoading && children}
				{isLoading && <LoadingIndicator />}
			</Card.Content>
			<Card.Footer className="footer">
				<Button
					buttonHandle={() => history.push(allMessagesPaths)}
					item={{
						label: translate('overview.viewAll'),
						type: BUTTON_TYPES.SMALL_ICON,
						smallIconBackgroundColor: 'secondary'
					}}
				/>
			</Card.Footer>
		</Card>
	);
};
