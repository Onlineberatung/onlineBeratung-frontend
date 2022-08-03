import * as React from 'react';
import { translate } from '../../utils/translate';
import { Button } from '../button/Button';
import { buttonItemSubmit } from '../registration/registrationHelpers';
import {
	AgencyDataInterface,
	ConsultantDataInterface,
	ConsultingTypeInterface,
	LegalLinkInterface
} from '../../globalState';
import Form from 'rc-field-form';
import './registrationFormDigi.styles.scss';
import { FormAccordion } from './FormAccordion';
import { apiGetTopicsData } from '../../api/apiGetTopicsData';
import { TopicsDataInterface } from '../../globalState/interfaces/TopicsDataInterface';
import { CheckboxGroupFormField } from './CheckboxGroupFormField';
import { RadioBoxGroup } from './RadioBoxGroup';
import { PasswordFormField } from './PasswordFormField';
import { apiPostRegistration } from '../../api/apiPostRegistration';
import { config } from '../../resources/scripts/config';
import { FETCH_ERRORS, X_REASON } from '../../api';
import { UsernameFormField } from './UsernameFormField';
import { AgencySelectionFormField } from './AgencyFields';
import { Gender } from '../../enums/Gender';
import { CounsellingRelation } from '../../enums/ConsellingRelation';
import { InputFormField } from './InputFormField';
import { CheckboxFormField } from './CheckboxFormField';
import { RegistrationSuccessOverlay } from './RegistrationSuccessOverlay';

interface RegistrationFormProps {
	consultingType?: ConsultingTypeInterface;
	agency?: AgencyDataInterface;
	consultant?: ConsultantDataInterface;
	legalLinks: Array<LegalLinkInterface>;
}

export const RegistrationFormDigi = ({
	consultingType,
	legalLinks,
	consultant
}: RegistrationFormProps) => {
	const [form] = Form.useForm();
	const [topics, setTopics] = React.useState([] as TopicsDataInterface[]);
	const [formErrors, setFormErrors] = React.useState([]); // This needs to be an array to trigger the changes on accordion
	const [registrationWithSuccess, setRegistrationWithSuccess] =
		React.useState(false);
	const [isUsernameAlreadyInUse, setIsUsernameAlreadyInUse] =
		React.useState(false);

	const [currentValues, setValues] = React.useState({
		'age': '',
		'agencyId': '',
		'username': '',
		'consultingTypeId': '',
		'postCode': '',
		'topicIds[]': []
	} as any);

	// When some that changes we check if the form is valid to enable/disable the submit button
	React.useEffect(() => {
		form.validateFields()
			.then(() => setFormErrors([]))
			.catch(({ errorFields }) => setFormErrors([...errorFields]));
	}, [currentValues, form]);

	// Request the topics data
	React.useEffect(() => {
		apiGetTopicsData().then((data) => setTopics(data));
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// When the form is submitted we send the data to the API
	const onSubmit = React.useCallback(
		(formValues) => {
			const finalValues = {
				consultingType: Number(consultingType.id),
				username: formValues.username,
				password: encodeURIComponent(formValues.password),
				agencyId: formValues.agencyId?.toString(),
				mainTopicId: formValues.mainTopicId?.toString(),
				postcode: formValues.postCode,
				termsAccepted: formValues.termsAccepted,
				gender: formValues.gender,
				age: Number(formValues.age),
				topicIds: formValues['topicIds[]'].map(Number),
				counsellingRelation: formValues.counsellingRelation
			};
			apiPostRegistration(config.endpoints.registerAsker, finalValues)
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
		[consultingType.id, form]
	);

	// When some topic id is selected we need to change the list of main topics
	const mainTopicOptions = React.useMemo(
		() =>
			topics
				.filter(
					(topic) =>
						(currentValues['topicIds[]'] || []).indexOf(
							topic.id
						) !== -1
				)
				.map(({ id, name }) => ({ label: name, value: id + '' })),
		[currentValues, topics]
	);

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

				<FormAccordion>
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
						errorOnTouchExtraFields={['username', 'password']}
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
									'mainTopicId'
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
											placeholder="z.B. 25"
											name="age"
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
									'mainTopicId'
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
								/>
							</FormAccordion.Item>

							<FormAccordion.Item
								title={translate(
									'registrationDigi.topics.step.title'
								)}
								formFields={['topicIds[]']}
							>
								<div className="registrationFormDigi__InputTopicIdsContainer">
									{topics?.map((topic) => (
										<CheckboxGroupFormField
											key={topic.id}
											label={topic.name}
											name="topicIds[]"
											localValue={topic.id}
										/>
									))}
								</div>
							</FormAccordion.Item>

							<FormAccordion.Item
								title={translate(
									'registrationDigi.mainTopics.step.title'
								)}
								formFields={['mainTopicId']}
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
										`<a target="_blank" href="${legalLink.url}">${legalLink.label}</a>`
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
