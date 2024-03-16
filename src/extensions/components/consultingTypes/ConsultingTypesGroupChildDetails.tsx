import * as React from 'react';
import { useEffect, useState } from 'react';
import ConsultingTypesAgencySelection from './ConsultingTypesAgencySelection';
import './consultingTypesGroupChildDetails.styles.scss';
import { useTranslation } from 'react-i18next';
import { apiGetConsultingType } from '../../../api';
import { LoadingIndicator } from '../../../components/loadingIndicator/LoadingIndicator';
import { ConsultingTypeInterface } from '../../../globalState/interfaces';
import { Text } from '../../../components/text/Text';
import { ArrowRightIcon } from '../../../resources/img/icons';
interface ConsultingTypesGroupChildDetailsProps {
	className?: string;
	consultingTypeId: number;
}

export const ConsultingTypesGroupChildDetails = ({
	className,
	consultingTypeId
}: ConsultingTypesGroupChildDetailsProps) => {
	const [consultingType, setConsultingType] =
		useState<ConsultingTypeInterface>();
	const { t: translate } = useTranslation(['common', 'consultingTypes']);

	useEffect(() => {
		let isCanceled;

		apiGetConsultingType({ consultingTypeId }).then((result) => {
			if (isCanceled) return;
			setConsultingType(result);
		});
		return () => {
			isCanceled = true;
		};
	}, [consultingTypeId]);

	if (consultingType == null) {
		return (
			<div className="consultingTypesGroupChildDetails__loadingIndicator">
				<LoadingIndicator />
			</div>
		);
	}

	return (
		<div className={className}>
			<Text
				type="infoLargeStandard"
				text={translate(
					[
						`consultingType.${consultingType.id}.description`,
						consultingType.description
					],
					{ ns: 'consultingTypes' }
				)}
			/>
			{consultingType.furtherInformation.url && (
				<a
					className="consultingTypesGroupChildDetails__details"
					href={consultingType.furtherInformation.url}
					target="_blank"
					rel="noreferrer"
				>
					<ArrowRightIcon
						className="consultingTypesGroupChildDetails__detailsIcon"
						width={10}
					/>
					<Text
						className="consultingTypesGroupChildDetails__detailsLabel"
						type="infoLargeStandard"
						text={translate(
							[
								`consultingType.${consultingType.id}.furtherInformation.label`,
								consultingType.furtherInformation.label
							],
							{ ns: 'consultingTypes' }
						)}
					/>
				</a>
			)}
			<Text
				className="consultingTypesGroupChildDetails__explanationTitle"
				type="infoLargeStandard"
				text={translate('consultingTypes.details.explanation.title')}
			/>
			<div className="consultingTypesGroupChildDetails__explanationDescription">
				{translate('consultingTypes.details.explanation.description')
					.split('\n')
					.map((part, index) => (
						<Text
							className="consultingTypesGroupChildDetails__explanationDescriptionPart"
							key={index}
							type="infoLargeStandard"
							text={part}
						/>
					))}
			</div>
			<ConsultingTypesAgencySelection consultingType={consultingType} />
		</div>
	);
};
