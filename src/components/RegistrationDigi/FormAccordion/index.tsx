import { FieldContext } from 'rc-field-form';
import { FormInstance } from 'rc-field-form';
import React, { useCallback, useState, Children } from 'react';
import { InvalidIcon } from '../../../resources/img/icons';
import { translate } from '../../../utils/translate';
import { Button, ButtonItem, BUTTON_TYPES } from '../../button/Button';
import './formAccordion.styles.scss';

interface FormAccordionProps {
	children: React.ReactChild | React.ReactChild[];
	onComplete?: () => void;
}

interface FormAccordionItemProps {
	disableNextButton?: boolean;
	form?: FormInstance;
	stepNumber?: number;
	title: string;
	subTitle?: string;
	formFields?: string[];
	errorOnTouchExtraFields?: string[];
	children: React.ReactChild | React.ReactChild[];
}

export const FormAccordion = ({ children, onComplete }: FormAccordionProps) => {
	const [activePanel, setActivePanel] = useState(0);

	const onClickNext = useCallback(() => {
		if (activePanel < Children.count(children) - 1) {
			setActivePanel(activePanel + 1);
		} else {
			setActivePanel(null);
			onComplete?.();
		}
	}, [activePanel, children, onComplete]);

	const handlePanelClick = useCallback(
		(panel: number) => {
			setActivePanel(activePanel === panel ? null : panel);
		},
		[activePanel]
	);

	return (
		<div className="formAccordionDigi">
			{Children.toArray(children).map((child, index) => {
				if (
					(child as JSX.Element).type.displayName !==
						'FormAccordionItem' &&
					process.env.NODE_ENV === 'development'
				) {
					console.warn('FormAccordionItem expected');
				}

				return (
					<FormAccordionPanel
						key={index}
						index={index}
						handlePanelClick={handlePanelClick}
						handleNextStep={onClickNext}
						isActive={activePanel === index}
						{...((child as JSX.Element)
							.props as FormAccordionItemProps)}
					/>
				);
			})}
		</div>
	);
};
FormAccordion.displayName = 'FormAccordion';

export const FormAccordionPanel = ({
	stepNumber,
	title,
	subTitle,
	formFields = [],
	errorOnTouchExtraFields = [],
	children,
	handlePanelClick,
	handleNextStep,
	isActive,
	index,
	form,
	disableNextButton
}: FormAccordionItemProps & {
	index: number;
	isActive: boolean;
	handlePanelClick: (index: number) => void;
	handleNextStep: () => void;
}) => {
	const formContext = React.useContext(FieldContext);
	const fieldsToCheck = [...formFields, ...errorOnTouchExtraFields];
	const isFieldsInValid = (form || formContext)
		.getFieldsError(formFields)
		.some((error) => error.errors.length !== 0);

	const isValid = !(
		formContext.isFieldsTouched(fieldsToCheck) && isFieldsInValid
	);

	const buttonAnswerVideoCall: ButtonItem = {
		title: translate('registration.accordion.item.continueButton.title'),
		label: translate('registration.accordion.item.continueButton'),
		type: BUTTON_TYPES.LINK
	};

	const childrenWithProps = Children.map(children, (child) => {
		// With this code we can have multi accordion levels and have a next button
		if ((child as JSX.Element)?.type?.displayName === 'FormAccordion') {
			return (
				child &&
				React.cloneElement(child as React.ReactElement, {
					onComplete: handleNextStep
				})
			);
		} else {
			return child;
		}
	});

	return (
		<div className={`formAccordionDigi__Panel ${isActive ? 'active' : ''}`}>
			<div
				className="formAccordionDigi__PanelHeader"
				onClick={() => handlePanelClick(index)}
			>
				{stepNumber && (
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
			>
				{childrenWithProps}

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

export const FormAccordionItem = ({ children }: FormAccordionItemProps) => (
	<div className="FormAccordionBody">{children}</div>
);

FormAccordionItem.displayName = 'FormAccordionItem';

FormAccordion.Item = FormAccordionItem;
