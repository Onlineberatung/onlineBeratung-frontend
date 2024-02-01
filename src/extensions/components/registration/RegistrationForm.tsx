import * as React from 'react';
import {
	Button,
	ButtonItem,
	BUTTON_TYPES
} from '../../../components/button/Button';
import { TenantContext } from '../../../globalState';
import { TopicsDataInterface } from '../../../globalState/interfaces';
import Form from 'rc-field-form';
import './registrationForm.styles.scss';
import { apiGetTopicsData } from '../../../api/apiGetTopicsData';
import { CheckboxGroupFormField } from './CheckboxGroupFormField';
import { RadioBoxGroup } from './RadioBoxGroup';
import { PasswordFormField } from './PasswordFormField';
import { apiPostRegistration, FETCH_ERRORS, X_REASON } from '../../../api';
import { UsernameFormField } from './UsernameFormField';
import { AgencySelectionFormField } from './AgencyFields';
import { InputFormField } from './InputFormField';
import { CheckboxFormField } from './CheckboxFormField';
import { RegistrationSuccessOverlay } from './RegistrationSuccessOverlay';
import { InfoTooltip } from '../../../components/infoTooltip/InfoTooltip';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAppConfig } from '../../../hooks/useAppConfig';
import { getTenantSettings } from '../../../utils/tenantSettingsHelper';
import { budibaseLogout } from '../../../components/budibase/budibaseLogout';
import { LegalLinksContext } from '../../../globalState/provider/LegalLinksProvider';
import { useTranslation } from 'react-i18next';
import { endpoints } from '../../../resources/scripts/endpoints';
import { useLocation } from 'react-router-dom';
import LegalLinks from '../../../components/legalLinks/LegalLinks';
import { FormAccordion } from './FormAccordion/FormAccordion';
import { FormAccordionItem } from './FormAccordion/FormAccordionItem';
import { UrlParamsContext } from '../../../globalState/provider/UrlParamsProvider';

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

interface FormData {
	'age': string;
	'agencyId': number;
	'username': string;
	'password': string;
	'consultingTypeId': number;
	'postCode': string;
	'topicIds[]': number[];
	'mainTopicId': number;
	'gender': Gender;
	'counsellingRelation': CounsellingRelation;
}

export const RegistrationForm = () => {
	const { tenant } = useContext(TenantContext);
	const settings = useAppConfig();
	const [form] = Form.useForm();
	const { agency, consultingType, consultant, topic } =
		useContext(UrlParamsContext);

	const [topics, setTopics] = useState([] as TopicsDataInterface[]);
	const [valid, setValid] = useState(false); // This needs to be an array to trigger the changes on accordion
	const [registrationWithSuccess, setRegistrationWithSuccess] =
		useState(false);
	const [isUsernameAlreadyInUse, setIsUsernameAlreadyInUse] = useState(false);
	const { featureToolsEnabled } = getTenantSettings();
	const { t: translate } = useTranslation();
	const legalLinks = useContext(LegalLinksContext);

	const initialValues = useMemo<FormData>(() => {
		const agencyId =
			consultant?.agencies?.length === 1
				? consultant.agencies[0].id
				: agency?.id || undefined;

		const consultingTypeId =
			consultant?.agencies?.length === 1
				? consultant.agencies[0].consultingType
				: agency?.consultingType || undefined;

		return {
			agencyId,
			consultingTypeId,
			'topicIds[]': []
		} as FormData;
	}, [agency?.consultingType, agency?.id, consultant?.agencies]);

	// Logout from budibase
	useEffect(() => {
		featureToolsEnabled && budibaseLogout();
	}, [featureToolsEnabled]);

	// When some that changes we check if the form is valid to enable/disable the submit button

	const store = Form.useWatch([], form);
	useEffect(() => {
		form.validateFields().then(
			() => {
				setValid(true);
			},
			() => {
				setValid(false);
			}
		);
	}, [store, form]);

	// Request the topics data
	useEffect(() => {
		(async () => {
			const topics = await apiGetTopicsData();
			setTopics(topics);
			if (!topic || !topics.find((t) => t.id === topic.id)) return;

			form.setFieldValue('mainTopicId', topic.id);
			form.setFieldValue('topicIds[]', [topic.id]);
		})();
	}, [form, topic]);

	const topicIds = Form.useWatch('topicIds[]', form);
	const mainTopicId = Form.useWatch('mainTopicId', form);
	useEffect(() => {
		if (topicIds?.length > 0 && !topicIds.includes(mainTopicId)) {
			form.setFieldValue('mainTopicId', topicIds[0]);
		}
	}, [mainTopicId, form, topicIds]);

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

	const preselectedAgencies = useMemo(
		() =>
			agency
				? [agency]
				: consultant?.agencies
					? consultant?.agencies
					: [],
		[agency, consultant?.agencies]
	);

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
				?.filter((topic) => (topicIds || []).includes(topic.id))
				.map(({ id, name }) => ({ label: name, value: id + '' })),
		[topicIds, topics]
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
				initialValues={initialValues}
				form={form}
				validateTrigger={['onBlur', 'onChange']}
			>
				<h2 className="registrationForm__headline">
					{translate('registrationDigi.headline')}
				</h2>
				{consultant && (
					<p>{translate('registrationDigi.teaser.consultant')}</p>
				)}

				<FormAccordion>
					{(props) => [
						<FormAccordionItem
							id={`step-1`}
							key={`step-1`}
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
							{...props}
						>
							<FormAccordion onComplete={props.handleNextStep}>
								{(props) => [
									<FormAccordionItem
										id={`step-ageAndGender`}
										key={`step-ageAndGender`}
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
										{...props}
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
													normalize={(
														value,
														prevValue
													) => {
														if (
															!value.match(
																/^\d{0,3}$/
															)
														) {
															return prevValue;
														}
														return value <= 100
															? value
															: 100;
													}}
													min={0}
													max={100}
													rule={{
														pattern: /^\d{0,3}$/,
														max: 100,
														min: 0
													}}
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
												options={Object.values(
													Gender
												).map((value) => ({
													label: translate(
														`registrationDigi.gender.options.${value.toLowerCase()}`
													),
													value
												}))}
											/>
										</div>
									</FormAccordionItem>,
									<FormAccordionItem
										id={`step-counsellingRelation`}
										key={`step-counsellingRelation`}
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
										{...props}
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
									</FormAccordionItem>,
									<FormAccordionItem
										id={`step-topics`}
										key={`step-topics`}
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
										{...props}
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
													<InfoTooltip
														translation={{
															ns: 'topics',
															prefix: 'topic'
														}}
														info={topic}
													/>
												</div>
											))}
										</div>
									</FormAccordionItem>,
									<FormAccordionItem
										id={`step-mainTopics`}
										key={`step-mainTopics`}
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
										{...props}
									>
										<RadioBoxGroup
											name="mainTopicId"
											dependencies={['topicIds[]']}
											normalize={(value) =>
												parseInt(value)
											}
											options={mainTopicOptions}
										/>
										{mainTopicOptions.length === 0 && (
											<p className="registrationFormDigi__NoTopics">
												{translate(
													'registrationDigi.mainTopics.selectAtLestOneTopic'
												)}
											</p>
										)}
									</FormAccordionItem>
								]}
							</FormAccordion>
						</FormAccordionItem>,
						<FormAccordionItem
							id={`step-2`}
							key={`step-2`}
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
							{...props}
						>
							<AgencySelectionFormField
								preselectedAgencies={preselectedAgencies}
								consultingType={consultingType}
							/>
						</FormAccordionItem>,
						<FormAccordionItem
							id={`step-3`}
							key={`step-3`}
							stepNumber={3}
							disableNextButton
							formFields={['password', 'username']}
							errorOnTouchExtraFields={['termsAccepted']}
							title={translate(
								'registrationDigi.accordion.step3.title'
							)}
							{...props}
						>
							<FormAccordion onComplete={props.handleNextStep}>
								{(props) => [
									<FormAccordionItem
										id={`step-username`}
										key={`step-username`}
										formFields={['username']}
										errorOnTouchExtraFields={['password']}
										title={translate(
											'registrationDigi.username.step.title'
										)}
										{...props}
									>
										<UsernameFormField
											inInUse={isUsernameAlreadyInUse}
										/>
									</FormAccordionItem>,
									<FormAccordionItem
										id={`step-password`}
										key={`step-password`}
										formFields={['password']}
										title={translate(
											'registrationDigi.password.step.title'
										)}
										{...props}
									>
										<PasswordFormField />
									</FormAccordionItem>
								]}
							</FormAccordion>
						</FormAccordionItem>
					]}
				</FormAccordion>

				<div className="registrationFormDigi__terms">
					<CheckboxFormField name="termsAccepted" localValue="true">
						<LegalLinks
							prefix={translate(
								'registration.dataProtection.label.prefix'
							)}
							lastDelimiter={translate(
								'registration.dataProtection.label.and'
							)}
							suffix={translate(
								'registration.dataProtection.label.suffix'
							)}
							delimiter={', '}
							filter={(legalLink) => legalLink.registration}
							legalLinks={legalLinks}
						/>
					</CheckboxFormField>
				</div>

				<Button
					disabled={!valid}
					className="registrationFormDigi__Submit"
					buttonHandle={() => form.submit()}
					item={buttonItemSubmit}
				/>
			</Form>

			{registrationWithSuccess && <RegistrationSuccessOverlay />}
		</>
	);
};
