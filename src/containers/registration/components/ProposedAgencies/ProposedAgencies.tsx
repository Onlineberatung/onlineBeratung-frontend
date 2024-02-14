import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useAgenciesForRegistration } from '../../hooks/useAgenciesForRegistration';
import { NoAgencyFound } from '../NoAgencyFound';
import { AgencySelection } from '../AgencySelection';
import { ConsultingTypeSelection } from '../ConsultingTypeSelection';
import { PostCodeSelection } from '../PostCodeSelection';
import { ProposedAgenciesTitle } from './ProposedAgenciesTitle';
import { VALID_POSTCODE_LENGTH } from '../../../../components/agencySelection/agencySelectionHelpers';
import { LoadingIndicator } from '../../../../components/loadingIndicator/LoadingIndicator';
import {
	AccordionItemValidity,
	VALIDITY_VALID,
	VALIDITY_INVALID
} from '../../../../components/registration/registrationHelpers';
import { AgencyDataInterface } from '../../../../globalState/interfaces';
import { LABEL_TYPES, Text } from '../../../../components/text/Text';
import './proposedAgencies.styles.scss';
import { useTranslation } from 'react-i18next';
import { PreselectedAgency } from '../PreSelectedAgency/PreselectedAgency';
import { FormAccordionData } from '../../../../components/registration/RegistrationForm';
import { UrlParamsContext } from '../../../../globalState/provider/UrlParamsProvider';

interface ProposedAgenciesProps {
	formAccordionData: FormAccordionData;
	agencySelectionNote?: string;
	onKeyDown?: (event?: KeyboardEvent) => void;
	onValidityChange?: (
		key: 'agency' | 'mainTopic',
		status: AccordionItemValidity
	) => void;
	onChange: (data: Partial<FormAccordionData>) => void;
}

export const ConsultingTypeRegistrationDefaults = {
	autoSelectPostcode: true,
	autoSelectAgency: false
};

export const ProposedAgencies = ({
	formAccordionData,
	agencySelectionNote,
	onKeyDown,
	onValidityChange,
	onChange
}: ProposedAgenciesProps) => {
	const { t } = useTranslation();

	const { agency: preSelectedAgency, slugFallback } =
		useContext(UrlParamsContext);

	const [isTouched, setIsTouched] = useState(false);

	const { autoSelectPostcode, autoSelectAgency } =
		formAccordionData.consultingType?.registration ||
		ConsultingTypeRegistrationDefaults;

	const isPostcodeValid = useCallback(
		(postcode) => postcode?.length === VALID_POSTCODE_LENGTH,
		[]
	);

	const { isLoading, agencies, consultingTypes } = useAgenciesForRegistration(
		{
			consultingType: formAccordionData.consultingType,
			topic: formAccordionData.mainTopic,
			postcode: formAccordionData.postcode
		}
	);

	const handleChange = useCallback(
		(data: Partial<FormAccordionData>, isTouched = true) => {
			onChange(data);
			if (isTouched) {
				setIsTouched(isTouched);
			}
		},
		[onChange]
	);

	const handleAgencyChange = useCallback(
		(agency: AgencyDataInterface, isTouched = true) => {
			handleChange(
				slugFallback
					? {
							agency
						}
					: {
							agency,
							consultingType: agency?.consultingTypeRel,
							...(autoSelectPostcode
								? { postcode: agency?.postcode }
								: {})
						},
				isTouched
			);
		},
		[autoSelectPostcode, handleChange, slugFallback]
	);

	// If options change, check for still valid preselected agency
	useEffect(() => {
		if (
			(!autoSelectAgency &&
				(agencies.length > 1 || agencies.length === 0) &&
				!formAccordionData.agency) ||
			(autoSelectAgency &&
				agencies.length === 0 &&
				!formAccordionData.agency) ||
			(formAccordionData.agency &&
				agencies.some((a) => a.id === formAccordionData.agency.id))
		) {
			return;
		}

		return handleAgencyChange(
			(autoSelectAgency && agencies.length > 0) || agencies.length === 1
				? agencies[0]
				: null,
			false
		);
	}, [
		agencies,
		autoSelectAgency,
		formAccordionData.agency,
		handleAgencyChange
	]);

	// If options change, check for still valid consulting type or select first one
	useEffect(() => {
		if (
			slugFallback ||
			(formAccordionData.consultingType &&
				consultingTypes.some(
					(ct) => ct.id === formAccordionData.consultingType.id
				)) ||
			(!formAccordionData.consultingType && consultingTypes.length === 0)
		) {
			return;
		}

		return onChange({ consultingType: consultingTypes?.[0] || null });
	}, [
		consultingTypes,
		formAccordionData.consultingType,
		onChange,
		slugFallback
	]);

	// Validate form if there are no changeable fields or changeable fields and they are touched
	useEffect(() => {
		if (
			isLoading ||
			(((!autoSelectPostcode &&
				!isPostcodeValid(formAccordionData.postcode)) ||
				consultingTypes.length > 1 ||
				agencies?.length > 1) &&
				!isTouched)
		) {
			return;
		}
		const agencyFound = agencies.find(
			(agency) => agency.id === formAccordionData.agency?.id
		);
		onValidityChange?.(
			'agency',
			(!autoSelectPostcode &&
				!isPostcodeValid(formAccordionData.postcode)) ||
				!agencyFound
				? VALIDITY_INVALID
				: VALIDITY_VALID
		);
	}, [
		agencies,
		autoSelectPostcode,
		consultingTypes.length,
		formAccordionData.agency?.id,
		formAccordionData.postcode,
		isLoading,
		isPostcodeValid,
		isTouched,
		onValidityChange
	]);

	return (
		<div
			className={`agencySelectionWrapper ${
				isLoading ? 'loading-agencies' : ''
			}`.trim()}
		>
			{!autoSelectPostcode && (
				<PostCodeSelection
					value={formAccordionData.postcode}
					onChange={(postCode) =>
						handleChange({ postcode: postCode })
					}
					isPreselectedAgency={!!preSelectedAgency}
				/>
			)}
			{agencySelectionNote && (
				<div data-cy="registration-agency-selection-note">
					<Text
						className="agencySelection__note"
						text={agencySelectionNote}
						type="infoLargeAlternative"
						labelType={LABEL_TYPES.NOTICE}
					/>
				</div>
			)}
			{consultingTypes.length > 1 && (
				<div className="consultingTypeSelection">
					<ConsultingTypeSelection
						value={
							formAccordionData.consultingType?.id?.toString() ||
							null
						}
						onChange={(id) =>
							handleChange({
								consultingType: consultingTypes.find(
									(ct) => ct.id.toString() === id
								)
							})
						}
						consultingTypes={consultingTypes}
						onKeyDown={onkeydown}
					/>
				</div>
			)}

			{isLoading && <LoadingIndicator />}

			{!agencies?.length &&
				(autoSelectPostcode ||
					isPostcodeValid(formAccordionData?.postcode)) &&
				!isLoading && (
					<NoAgencyFound
						handleKeyDown={onKeyDown}
						postCode={formAccordionData.postcode}
						consultingType={formAccordionData.consultingType}
					/>
				)}

			{!isLoading &&
				agencies.length === 1 &&
				formAccordionData.agency && (
					<PreselectedAgency
						prefix={t('registration.agency.preselected.prefix')}
						agencyData={formAccordionData.agency}
						onKeyDown={onKeyDown}
					/>
				)}

			{!isLoading && agencies?.length > 1 && (
				<div className="agencySelectionContainer">
					<ProposedAgenciesTitle
						hasPreselectedAgency={!!preSelectedAgency}
						hasConsultingTypes={consultingTypes.length > 1}
						hasAutoSelectPostCodeEnabled={autoSelectPostcode}
						postCodeValue={formAccordionData.postcode}
						agenciesCount={agencies.length}
					/>
					<div className="agencySelection">
						{agencies.map((agency) => (
							<AgencySelection
								key={agency.id}
								agency={agency}
								checkedValue={formAccordionData.agency?.id.toString()}
								onChange={(id) =>
									handleAgencyChange(
										agencies.find(
											(a) => a.id.toString() === id
										)
									)
								}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
