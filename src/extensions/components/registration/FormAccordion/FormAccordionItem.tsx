import { FieldContext } from 'rc-field-form';
import React, { FC } from 'react';
import './formAccordion.styles.scss';
import { useTranslation } from 'react-i18next';
import {
	Button,
	BUTTON_TYPES,
	ButtonItem
} from '../../../../components/button/Button';
import { InvalidIcon } from '../../../../resources/img/icons';
import { FormAccordionChildProps } from './FormAccordion';
import classNames from 'classnames';

export interface FormAccordionItemProps {
	id?: string;
	disableNextButton?: boolean;
	stepNumber?: number;
	title: string;
	subTitle?: string;
	formFields?: string[];
	errorOnTouchExtraFields?: string[];
}

export const FormAccordionItem: FC<
	FormAccordionItemProps & FormAccordionChildProps
> = ({
	id,
	stepNumber,
	title,
	subTitle,
	formFields = [],
	errorOnTouchExtraFields = [],
	children,
	handlePanelClick,
	handleNextStep,
	activePanel,
	disableNextButton
}) => {
	const formContext = React.useContext(FieldContext);
	const fieldsToCheck = [...formFields, ...errorOnTouchExtraFields];

	const isFieldsInValid = formContext
		.getFieldsError(formFields)
		.some((error) => error.errors.length !== 0);

	const isValid = !(
		formContext.isFieldsTouched(fieldsToCheck) && isFieldsInValid
	);

	const { t: translate } = useTranslation();

	const buttonAnswerVideoCall: ButtonItem = {
		title: translate('registration.accordion.item.continueButton.title'),
		label: translate('registration.accordion.item.continueButton.label'),
		type: BUTTON_TYPES.LINK
	};

	const isActive = activePanel === id;

	return (
		<div
			className={classNames('formAccordionDigi__Panel', {
				active: isActive
			})}
			id={`panel-${id}`}
		>
			<div
				role="button"
				className="formAccordionDigi__PanelHeader"
				onKeyDown={(e) => e.code === 'Space' && handlePanelClick(id)}
				onFocus={(ev) => {
					ev.preventDefault();
					ev.stopPropagation();

					handlePanelClick(id, true);
				}}
				onClick={() => handlePanelClick(id)}
				aria-controls={`content-${id}`}
				aria-expanded={isActive}
				tabIndex={0}
			>
				{!!stepNumber && (
					<div className="formAccordionDigi__StepNumber">
						{stepNumber}
					</div>
				)}
				<div className="formAccordionDigiTitle">{title}</div>
				{subTitle && (
					<div className="formAccordionDigiSubTitle">{subTitle}</div>
				)}
				{!isValid && (
					<div className="formAccordionDigiSubTitleWarn">
						<InvalidIcon className="validationIcon validationIcon--invalid" />
					</div>
				)}
			</div>
			<div
				className={`formAccordionDigi__Content ${
					isActive ? 'active' : ''
				}`}
				aria-hidden={!isActive}
				id={`content-${id}`}
			>
				{children}

				{!disableNextButton && (
					<Button
						buttonHandle={handleNextStep}
						item={buttonAnswerVideoCall}
						disabled={isFieldsInValid}
						className="formAccordionItem__continueButton"
						tabIndex={-1}
					/>
				)}
			</div>
		</div>
	);
};
