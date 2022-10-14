import { Field, FieldContext } from 'rc-field-form';
import { HOOK_MARK } from 'rc-field-form/lib/FieldContext';
import React, { useEffect, useState } from 'react';
import { apiAgencySelection, FETCH_ERRORS } from '../../../../api';
import { ConsultingTypeBasicInterface } from '../../../../globalState';
import { AgencyDataInterface } from '../../../../globalState/interfaces/UserDataInterface';
import { PinIcon } from '../../../../resources/img/icons';
import { VALID_POSTCODE_LENGTH } from '../../../agencySelection/agencySelectionHelpers';
import { PreselectedAgency } from '../../../agencySelection/PreselectedAgency';
import { Loading } from '../../../app/Loading';
import { InputField } from '../../../inputField/InputField';
import { Text } from '../../../text/Text';
import { AgencyRadioButtonForm } from '../Agency';
import { NoAgencyFound } from '../NoAgencyFound';
import './agencySelection.styles.scss';
import { useTranslation } from 'react-i18next';

interface AgencySelectionFormFieldProps {
	preselectedAgencies?: AgencyDataInterface[];
	consultingType: ConsultingTypeBasicInterface;
}

const PostCodeInput = ({
	value,
	onChange
}: {
	value?: string;
	onChange?: (value: string) => void;
}) => {
	const { t: translate } = useTranslation();

	return (
		<InputField
			item={{
				name: 'postcode',
				class: 'asker__registration__postcodeInput',
				id: 'postcode',
				type: 'number',
				label: translate('registration.agencySelection.postcode.label'),
				content: value,
				maxLength: VALID_POSTCODE_LENGTH,
				pattern: '^[0-9]+$',
				icon: <PinIcon />
			}}
			inputHandle={(e) => onChange(e.target.value)}
		/>
	);
};

const AgencyRadioInput = ({
	agencies,
	value,
	onChange
}: {
	agencies: AgencyDataInterface[];
	value?: number;
	onChange?: (value: number) => void;
}) => {
	const field = React.useContext(FieldContext);
	return (
		<>
			{agencies?.map((agency: AgencyDataInterface) => (
				<AgencyRadioButtonForm
					agency={agency}
					key={agency.id}
					value={value}
					onChange={(e) => {
						onChange(e);
						field.setFieldValue(
							'consultingTypeId',
							agency.consultingType
						);
					}}
				/>
			))}
		</>
	);
};

const REGEX_POSTCODE = /\d{5}/;
export const AgencySelection = ({
	consultingType,
	preselectedAgencies
}: AgencySelectionFormFieldProps) => {
	const field = React.useContext(FieldContext);
	const [isLoading, setIsLoading] = useState(false);
	const [agencies, setAgencies] = useState<AgencyDataInterface[]>([
		...(preselectedAgencies || [])
	]);
	const { mainTopicId, gender, age, postCode } = field.getFieldsValue();
	const isValidToRequestData =
		!preselectedAgencies?.length &&
		mainTopicId &&
		age &&
		gender &&
		!!postCode?.match(REGEX_POSTCODE);

	const { t: translate } = useTranslation();
	// Only runs when no preselected agencies are provided
	useEffect(() => {
		if (isValidToRequestData) {
			setIsLoading(true);
			apiAgencySelection({
				postcode: postCode,
				consultingType: consultingType.id,
				topicId: mainTopicId,
				age: age,
				gender: gender
			})
				.then((response) => {
					setAgencies(response);
					if (response.length === 1) {
						field.setFieldValue(
							'consultingTypeId',
							response[0].consultingType
						);
						field.getInternalHooks(HOOK_MARK).dispatch({
							type: 'updateValue',
							namePath: ['agencyId'],
							value: response[0].id
						});
					}
				})
				.catch((err) => {
					if (err.message === FETCH_ERRORS.EMPTY) {
						return setAgencies([]);
					}
					return Promise.reject(err);
				})
				.finally(() => setIsLoading(false));
		} else if (!preselectedAgencies?.length) {
			field.setFieldValue('agencyId', null);
			setAgencies([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		consultingType.id,
		mainTopicId,
		age,
		gender,
		postCode,
		isValidToRequestData
	]);

	const introItemsTranslations = !!preselectedAgencies?.length
		? [
				'registration.agencyPreselected.intro.point1',
				'registration.agencyPreselected.intro.point2'
		  ]
		: [
				'registration.agencySelection.intro.point1',
				'registration.agencySelection.intro.point2',
				'registration.agencySelection.intro.point3'
		  ];

	return (
		<div className="agencySelection">
			<div className="agencySelection__intro">
				<Text
					text={
						!!preselectedAgencies?.length
							? translate(
									'registration.agencyPreselected.intro.overline'
							  )
							: translate(
									'registration.agencySelection.intro.overline'
							  )
					}
					type="infoLargeAlternative"
				/>
				<div className="agencySelection__intro__content">
					<Text
						text={
							!!preselectedAgencies?.length
								? translate(
										'registration.agencyPreselected.intro.subline'
								  )
								: translate(
										'registration.agencySelection.intro.subline'
								  )
						}
						type="infoLargeAlternative"
					/>
					<ul>
						{introItemsTranslations.map(
							(introItemTranslation, i) => (
								<li key={i}>
									<Text
										text={translate(introItemTranslation)}
										type="infoLargeAlternative"
									/>
								</li>
							)
						)}
					</ul>
				</div>
			</div>

			<Field
				name="postCode"
				rules={[{ required: true, pattern: REGEX_POSTCODE }]}
			>
				<PostCodeInput />
			</Field>

			{isLoading && <Loading />}
			{!isLoading && isValidToRequestData && agencies.length === 0 && (
				<NoAgencyFound className="registrationDigi__noAgencyFound" />
			)}
			{!isLoading &&
				(isValidToRequestData || preselectedAgencies?.length > 1) &&
				agencies.length > 0 && (
					<>
						<div className="agencySelection__proposedAgencies">
							<h3>
								{translate(
									'registration.agencySelection.title.start'
								)}{' '}
								{postCode}
								{translate(
									'registration.agencySelection.title.end'
								)}
							</h3>
						</div>

						<Field name="agencyId" rules={[{ required: true }]}>
							<AgencyRadioInput agencies={agencies} />
						</Field>
					</>
				)}

			{preselectedAgencies?.length === 1 && (
				<>
					<PreselectedAgency
						prefix={translate(
							'registration.agency.preselected.prefix'
						)}
						agencyData={preselectedAgencies[0]}
					/>
				</>
			)}
		</div>
	);
};
