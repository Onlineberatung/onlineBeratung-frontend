import clsx from 'clsx';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ConsultingTypesGroupChildDetails } from './ConsultingTypesGroupChildDetails';
import { ConsultingTypeGroupChildInterface } from '../../globalState/interfaces/ConsultingTypeGroupInterface';
import { ArrowDownIcon, ArrowUpIcon } from '../../../resources/img/icons';
import { Text } from '../../../components/text/Text';
import './ConsultingTypesGroupChild.styles.scss';

interface ConsultingTypesGroupChildProps {
	groupChild: ConsultingTypeGroupChildInterface;
	handleToggleExpanded(): void;
	isExpanded: boolean;
}

export const ConsultingTypesGroupChild = ({
	groupChild,
	handleToggleExpanded,
	isExpanded
}: ConsultingTypesGroupChildProps) => {
	const { t: translate } = useTranslation(['consultingTypes']);
	const iconProps = {
		width: 14,
		className: 'consultingTypesGroupChild__icon'
	};

	return (
		<div
			className={clsx(
				'consultingTypesGroupChild',
				isExpanded && 'consultingTypesGroupChild--expanded'
			)}
		>
			<button
				onClick={handleToggleExpanded}
				className="consultingTypesGroupChild__title"
			>
				<Text
					className="consultingTypesGroupChild__titleLabel"
					type="standard"
					text={translate(
						[
							`consultingType.${groupChild.id}.titles.long`,
							groupChild.titles.long
						],
						{ ns: 'consultingTypes' }
					)}
				/>
				{isExpanded ? (
					<ArrowUpIcon {...iconProps} />
				) : (
					<ArrowDownIcon {...iconProps} />
				)}
			</button>
			{isExpanded && (
				<ConsultingTypesGroupChildDetails
					className="consultingTypesGroupChild__details"
					consultingTypeId={groupChild.id}
				/>
			)}
		</div>
	);
};
