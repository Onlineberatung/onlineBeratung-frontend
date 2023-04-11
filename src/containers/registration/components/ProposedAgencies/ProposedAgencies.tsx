import React, { useCallback, useEffect, useState } from 'react';
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
	VALIDITY_INITIAL,
	VALIDITY_INVALID
} from '../../../../components/registration/registrationHelpers';
import {
	ConsultantDataInterface,
	AgencyDataInterface,
	ConsultingTypeInterface
} from '../../../../globalState';
import { getUrlParameter } from '../../../../utils/getUrlParameter';
import { LABEL_TYPES, Text } from '../../../../components/text/Text';
import './proposedAgencies.styles.scss';
import { useTranslation } from 'react-i18next';
import { PreselectedAgency } from '../PreSelectedAgency/PreselectedAgency';

interface ProposedAgenciesProps {
	consultant: ConsultantDataInterface;
	preSelectedAgency: AgencyDataInterface;
	consultingType: ConsultingTypeInterface;
	mainTopicId: number;
	agencySelectionNote?: string;
	handleKeyDown?: (event?: KeyboardEvent) => void;
	onValidityChange?: (status: AccordionItemValidity) => void;
	onChange: (agency: AgencyDataInterface) => void;
}

export const ProposedAgencies = ({
	consultant,
	preSelectedAgency: propPreselectedAgency,
	consultingType,
	mainTopicId,
	agencySelectionNote,
	handleKeyDown,
	onValidityChange,
	onChange
}: ProposedAgenciesProps) => {
	const { t } = useTranslation();
	const initialPostcode = getUrlParameter('postcode');
	const { autoSelectPostcode, autoSelectAgency } =
		consultingType?.registration || {
			autoSelectPostcode: true
		};

	// Set the default selected agency
	const [isTouched, setIsTouched] = useState<boolean>(false);
	const [agencySelected, setAgencySelected] = useState<string>();
	const [selectedConsultingType, selectConsultingType] =
		useState<string>(null);
	const [postCodeValue, setPostCode] = useState<string>(initialPostcode);

	const validPostcode = useCallback(
		() => postCodeValue?.length === VALID_POSTCODE_LENGTH,
		[postCodeValue]
	);

	const { isLoading, agencies, consultingTypes, preSelectedAgency } =
		useAgenciesForRegistration({
			consultant,
			preSelectedAgency: propPreselectedAgency,
			consultingType,
			mainTopicId,
			postcode: postCodeValue
		});

	useEffect(() => {
		if (!isTouched) {
			setIsTouched(!!preSelectedAgency || !!postCodeValue);
		}
	}, [isTouched, postCodeValue, preSelectedAgency]);

	// Set the agency selection if it was preselected by params
	useEffect(
		() => setAgencySelected(preSelectedAgency?.id?.toString()),
		[preSelectedAgency]
	);

	// Set the the form item status and set the agency to the form accordion
	useEffect(() => {
		const agencyFound = agencies.find(
			(tmpAgency) => tmpAgency.id.toString() === agencySelected
		);

		onChange(agencyFound);

		if (
			isTouched &&
			(!agencySelected || (!autoSelectPostcode && !validPostcode()))
		) {
			onValidityChange?.(VALIDITY_INVALID);
		} else {
			onValidityChange?.(
				agencySelected && agencyFound
					? VALIDITY_VALID
					: VALIDITY_INITIAL
			);
		}
	}, [
		agencies,
		agencySelected,
		autoSelectPostcode,
		isLoading,
		isTouched,
		onChange,
		onValidityChange,
		validPostcode
	]);

	return (
		<div
			className={`agencySelectionWrapper ${
				isLoading ? 'loading-agencies' : ''
			}`.trim()}
		>
			{!autoSelectPostcode && (
				<PostCodeSelection
					value={postCodeValue}
					onChange={setPostCode}
					isPreselectedAgency={
						preSelectedAgency && !autoSelectPostcode
					}
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
						value={selectedConsultingType}
						onChange={selectConsultingType}
						consultingTypes={consultingTypes}
						onKeyDown={onkeydown}
					/>
				</div>
			)}

			{!agencies?.length &&
				((!autoSelectPostcode && validPostcode()) ||
					autoSelectPostcode) &&
				!isLoading && (
					<NoAgencyFound
						handleKeyDown={handleKeyDown}
						postCode={postCodeValue}
						consultingType={consultingType}
					/>
				)}

			{isLoading && <LoadingIndicator />}

			{autoSelectAgency && preSelectedAgency && (
				<PreselectedAgency
					prefix={t('registration.agency.preselected.prefix')}
					agencyData={preSelectedAgency}
					onKeyDown={handleKeyDown}
				/>
			)}

			{agencies?.length > 0 && (!autoSelectAgency || !preSelectedAgency) && (
				<div className="agencySelectionContainer">
					<ProposedAgenciesTitle
						hasPreselectedAgency={!!propPreselectedAgency}
						hasConsultingTypes={consultingTypes.length > 1}
						hasAutoSelectPostCodeEnabled={autoSelectPostcode}
						postCodeValue={postCodeValue}
						agenciesCount={agencies.length}
					/>
					<div className="agencySelection">
						{agencies.map((agency) => (
							<AgencySelection
								key={agency.id}
								agency={agency}
								checkedValue={agencySelected}
								onChange={setAgencySelected}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
