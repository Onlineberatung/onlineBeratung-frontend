import * as React from 'react';
import {
	Button,
	ButtonItem,
	BUTTON_TYPES
} from '../../../components/button/Button';
import {
	AgencyDataInterface,
	ConsultantDataInterface,
	ConsultingTypeInterface,
	TenantContext
} from '../../../globalState';
import Form from 'rc-field-form';
import './registrationForm.styles.scss';
import { FormAccordion } from './FormAccordion';
import { apiGetTopicsData } from '../../../api/apiGetTopicsData';
import { TopicsDataInterface } from '../../../globalState/interfaces/TopicsDataInterface';
import { CheckboxGroupFormField } from './CheckboxGroupFormField';
import { RadioBoxGroup } from './RadioBoxGroup';
import { PasswordFormField } from './PasswordFormField';
import { apiPostRegistration } from '../../../api';
import { FETCH_ERRORS, X_REASON } from '../../../api';
import { UsernameFormField } from './UsernameFormField';
import { AgencySelectionFormField } from './AgencyFields';
import { InputFormField } from './InputFormField';
import { CheckboxFormField } from './CheckboxFormField';
import { RegistrationSuccessOverlay } from './RegistrationSuccessOverlay';
import { AgencyInfo } from '../../../components/agencySelection/AgencyInfo';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAppConfig } from '../../../hooks/useAppConfig';
import { getTenantSettings } from '../../../utils/tenantSettingsHelper';
import { budibaseLogout } from '../../../components/budibase/budibaseLogout';
import { LegalLinksContext } from '../../../globalState/provider/LegalLinksProvider';
import { useTranslation } from 'react-i18next';
import { endpoints } from '../../../resources/scripts/endpoints';
import { isNumber } from '../../../utils/isNumber';
import { useLocation } from 'react-router-dom';

enum CounsellingRelation {
	Self = 'SELF_COUNSELLING',
	Relative = 'RELATIVE_COUNSELLING',
	Parental = 'PARENTAL_COUNSELLING'
}

enum Gender {
	Male = 'MALE',
	Female = 'FEMALE',
	Diverse = 'DIVERSE',
	NotProvided = 'NOT_PROVIDED'
}

interface RegistrationFormProps {
	consultingType?: ConsultingTypeInterface;
	agency?: AgencyDataInterface;
	consultant?: ConsultantDataInterface;
	topic?: TopicsDataInterface;
}

export const RegistrationForm = ({
	agency: preselectedAgency,
	consultingType,
	consultant,
	topic
}: RegistrationFormProps) => {
	const { tenant } = useContext(TenantContext);
	const settings = useAppConfig();
	const [form] = Form.useForm();

	const [topics, setTopics] = useState([] as TopicsDataInterface[]);
	const [formErrors, setFormErrors] = useState([]); // This needs to be an array to trigger the changes on accordion
	const [registrationWithSuccess, setRegistrationWithSuccess] =
		useState(false);
	const [isUsernameAlreadyInUse, setIsUsernameAlreadyInUse] = useState(false);
	const { featureToolsEnabled } = getTenantSettings();
	const { t: translate } = useTranslation();
	const legalLinks = useContext(LegalLinksContext);

	const [currentValues, setValues] = useState({
		'age': '',
		'agencyId':
			consultant?.agencies?.length === 1
				? consultant.agencies[0].id
				: isNumber(`${preselectedAgency?.id}`)
					? preselectedAgency?.id
					: '',
		'username': '',
		'consultingTypeId':
			consultant?.agencies?.length === 1
				? consultant.agencies[0].consultingType
				: preselectedAgency?.consultingType || '',
		'postCode': '',
		'topicIds[]': []
	} as any);

	// Logout from budibase
	useEffect(() => {
		featureToolsEnabled && budibaseLogout();
	}, [featureToolsEnabled]);

	// When some that changes we check if the form is valid to enable/disable the submit button
	useEffect(() => {
		form.validateFields()
			.then(() => setFormErrors([]))
			.catch(({ errorFields }) => setFormErrors([...errorFields]));
	}, [currentValues, form]);

	// Request the topics data
	useEffect(() => {
		(async () => {
			const topics = await apiGetTopicsData();
			setTopics(topics);
			if (!topic || !topics.find((t) => t.id === topic.id)) return;

			form.setFieldValue('mainTopicId', topic.id);
			form.setFieldValue('topicIds[]', [topic.id]);
			setValues((v) => ({
				...v,
				'topicIds[]': [topic.id],
				'mainTopicId': topic.id
			}));
		})();
	}, [form, topic]);

	// Request the topics data
	useEffect(() => {
		if (
			currentValues['topicIds[]']?.length === 1 &&
			currentValues.mainTopicId !== currentValues['topicIds[]'][0]
		) {
			form.setFieldValue('mainTopicId', currentValues['topicIds[]'][0]);
			setValues({
				...currentValues,
				mainTopicId: currentValues['topicIds[]'][0]
			});
		}
	}, [topics, currentValues, form]);

	const useQuery = () => {
		const { search } = useLocation();
		return useMemo(() => new URLSearchParams(search), [search]);
	};
	const urlQuery: URLSearchParams = useQuery();

	// Only max. 8 alphanumeric characters are allowed in the ref parameter
	const getValidRef = (ref: string) =>
		ref.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);

	// Get the counselling relation from the query parameter
	const getCounsellingRelation = (): string | null => {
		const queryRelation = urlQuery.get('counsellingRelation');

		if (!queryRelation) return null;

		const fullRelation = `${queryRelation.toUpperCase()}_COUNSELLING`;
		const allRelations: string[] = Object.values(CounsellingRelation);

		if (allRelations.includes(fullRelation)) {
			return fullRelation;
		}

		return null;
	};

	// When the form is submitted we send the data to the API
	const onSubmit = useCallback(
		(formValues) => {
			const finalValues = {
				username: formValues.username,
				password: encodeURIComponent(formValues.password),
				agencyId: formValues.agencyId?.toString(),
				mainTopicId: formValues.mainTopicId?.toString(),
				postcode: formValues.postCode,
				termsAccepted: formValues.termsAccepted,
				gender: formValues.gender,
				age: Number(formValues.age),
				topicIds: formValues['topicIds[]'].map(Number),
				counsellingRelation: formValues.counsellingRelation,
				consultingType: formValues.consultingTypeId,
				...(consultant && { consultantId: consultant.consultantId }),
				referer: urlQuery.get('ref')
					? getValidRef(urlQuery.get('ref'))
					: null
			};
			apiPostRegistration(
				endpoints.registerAsker,
				finalValues,
				settings.multitenancyWithSingleDomainEnabled,
				tenant
			)
				.then(() => setRegistrationWithSuccess(true))
				.catch((errorRes) => {
					if (
						errorRes.status === 409 &&
						errorRes.headers?.get(FETCH_ERRORS.X_REASON) ===
							X_REASON.USERNAME_NOT_AVAILABLE
					) {
						form.setFields([
							{
								name: 'username',
								errors: ['Username already in use']
							}
						]);
						setIsUsernameAlreadyInUse(true);
					}
				});
		},
		[consultant, form, settings, tenant, urlQuery]
	);

	// When some topic id is selected we need to change the list of main topics
	const mainTopicOptions = useMemo(
		() =>
			topics
				?.filter((topic) =>
					(currentValues['topicIds[]'] || []).includes(topic.id)
				)
				.map(({ id, name }) => ({ label: name, value: id + '' })),
		[currentValues, topics]
	);

	const buttonItemSubmit: ButtonItem = {
		label: translate('registration.submitButton.label'),
		type: BUTTON_TYPES.PRIMARY
	};

	return (
		<>
			<Form
				className="registrationFormDigi"
				id="registrationForm"
				onFinish={onSubmit}
				onValuesChange={(changedValues, currentValues) =>
					setValues({ ...currentValues, ...changedValues })
				}
				initialValues={currentValues}
				form={form}
				validateTrigger={['onBlur', 'onChange']}
			>
				<h2 className="registrationForm__headline">
					{translate('registrationDigi.headline')}
				</h2>
				{consultant && (
					<p>{translate('registrationDigi.teaser.consultant')}</p>
				)}

				<FormAccordion enableAutoScroll>
					<FormAccordion.Item
						disableNextButton
						stepNumber={1}
						title={translate(
							'registrationDigi.accordion.step1.title'
						)}
						formFields={[
							'age',
							'gender',
							'topicIds[]',
							'mainTopicId'
						]}
						errorOnTouchExtraFields={[
							'postCode',
							'agencyId',
							'username',
							'password'
						]}
					>
						<FormAccordion>
							<FormAccordion.Item
								title={translate(
									'registrationDigi.ageAndGender.step.title'
								)}
								formFields={['age', 'gender']}
								errorOnTouchExtraFields={[
									'counsellingRelation',
									'topicIds[]',
									'mainTopicId',
									'agencyId',
									'postCode',
									'username',
									'password'
								]}
							>
								<div className="registrationFormDigi__AgeContainer">
									<label className="registrationFormDigi__AgeContainerLabel">
										{translate(
											'registrationDigi.age.headline'
										)}
									</label>
									<div className="registrationFormDigi__InputGroup">
										<InputFormField
											autoFocus
											tabIndex={0}
											placeholder="z.B. 25"
											name="age"
											min={0}
											max={100}
											pattern={/\d+/}
											type="number"
										/>
										<div className="input-group__unit">
											{translate(
												'registrationDigi.age.label'
											)}
										</div>
									</div>
								</div>

								<div className="registrationFormDigi__GenderContainer">
									<label className="registrationFormDigi__GenderContainerLabel">
										{translate(
											'registrationDigi.gender.headline'
										)}
									</label>

									<RadioBoxGroup
										name="gender"
										options={Object.values(Gender).map(
											(value) => ({
												label: translate(
													`registrationDigi.gender.options.${value.toLowerCase()}`
												),
												value
											})
										)}
									/>
								</div>
							</FormAccordion.Item>

							<FormAccordion.Item
								title={translate(
									'registrationDigi.counsellingRelation.step.title'
								)}
								formFields={['counsellingRelation']}
								errorOnTouchExtraFields={[
									'counsellingRelation',
									'topicIds[]',
									'mainTopicId',
									'agencyId',
									'postCode',
									'username',
									'password'
								]}
							>
								<RadioBoxGroup
									name="counsellingRelation"
									options={Object.values(
										CounsellingRelation
									).map((value) => ({
										label: translate(
											`registrationDigi.counsellingRelation.options.${value.toLowerCase()}`
										),
										value
									}))}
									preset={getCounsellingRelation()}
								/>
							</FormAccordion.Item>

							<FormAccordion.Item
								title={translate(
									'registrationDigi.topics.step.title'
								)}
								formFields={['topicIds[]']}
								errorOnTouchExtraFields={[
									'mainTopicId',
									'agencyId',
									'postCode',
									'username',
									'password'
								]}
							>
								<div className="registrationFormDigi__InputTopicIdsContainer">
									{topics?.map((topic) => (
										<div
											className="registrationFormDigi__InputTopicIdsContainerGroup"
											key={topic.id}
										>
											<CheckboxGroupFormField
												label={topic.name}
												name="topicIds[]"
												localValue={topic.id}
											/>
											<AgencyInfo
												agency={
													topic as unknown as AgencyDataInterface
												}
											/>
										</div>
									))}
								</div>
							</FormAccordion.Item>

							<FormAccordion.Item
								title={translate(
									'registrationDigi.mainTopics.step.title'
								)}
								formFields={['mainTopicId']}
								errorOnTouchExtraFields={[
									'agencyId',
									'postCode',
									'username',
									'password'
								]}
							>
								<RadioBoxGroup
									name="mainTopicId"
									dependencies={['topicIds[]']}
									options={mainTopicOptions}
								/>
								{mainTopicOptions.length === 0 && (
									<p className="registrationFormDigi__NoTopics">
										{translate(
											'registrationDigi.mainTopics.selectAtLestOneTopic'
										)}
									</p>
								)}
							</FormAccordion.Item>
						</FormAccordion>
					</FormAccordion.Item>

					<FormAccordion.Item
						form={form}
						stepNumber={2}
						formFields={['agencyId', 'postCode']}
						errorOnTouchExtraFields={[
							'username',
							'password',
							'termsAccepted'
						]}
						title={translate(
							'registrationDigi.accordion.step2.title'
						)}
					>
						<AgencySelectionFormField
							preselectedAgencies={
								preselectedAgency
									? [preselectedAgency]
									: consultant?.agencies
										? consultant?.agencies
										: []
							}
							consultingType={consultingType}
						/>
					</FormAccordion.Item>

					<FormAccordion.Item
						stepNumber={3}
						disableNextButton
						formFields={['password', 'username']}
						errorOnTouchExtraFields={['termsAccepted']}
						title={translate(
							'registrationDigi.accordion.step3.title'
						)}
					>
						<FormAccordion>
							<FormAccordion.Item
								tabIndex={0}
								formFields={['username']}
								errorOnTouchExtraFields={['password']}
								title={translate(
									'registrationDigi.username.step.title'
								)}
							>
								<UsernameFormField
									inInUse={isUsernameAlreadyInUse}
								/>
							</FormAccordion.Item>
							<FormAccordion.Item
								tabIndex={0}
								formFields={['password']}
								title={translate(
									'registrationDigi.password.step.title'
								)}
							>
								<PasswordFormField />
							</FormAccordion.Item>
						</FormAccordion>
					</FormAccordion.Item>
				</FormAccordion>

				<div className="registrationFormDigi__terms">
					<CheckboxFormField
						label={[
							translate(
								'registration.dataProtection.label.prefix'
							),
							legalLinks
								.filter((legalLink) => legalLink.registration)
								.map(
									(legalLink, index, { length }) =>
										(index > 0
											? index < length - 1
												? ', '
												: translate(
														'registration.dataProtection.label.and'
													)
											: '') +
										`<a target="_blank" href="${legalLink.getUrl(
											{
												//aid: specificAgency?.id
											}
										)}">${translate(legalLink.label)}</a>`
								)
								.join(''),
							translate(
								'registration.dataProtection.label.suffix'
							)
						].join(' ')}
						name="termsAccepted"
						localValue="true"
					/>
				</div>

				<Button
					disabled={formErrors.length > 0}
					className="registrationFormDigi__Submit"
					buttonHandle={() => form.submit()}
					item={buttonItemSubmit}
				/>
			</Form>

			{registrationWithSuccess && <RegistrationSuccessOverlay />}
		</>
	);
};
