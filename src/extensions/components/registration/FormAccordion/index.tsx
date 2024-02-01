import { FieldContext } from 'rc-field-form';
import { FormInstance } from 'rc-field-form';
import React, { useCallback, useState, Children, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { InvalidIcon } from '../../../../resources/img/icons';
import {
	Button,
	ButtonItem,
	BUTTON_TYPES
} from '../../../../components/button/Button';
import { useTranslation } from 'react-i18next';
import './formAccordion.styles.scss';

interface FormAccordionProps {
	enableAutoScroll?: boolean;
	children: React.ReactChild | React.ReactChild[];
	onComplete?: () => void;
}

const scrollOffset = 80;

interface FormAccordionItemProps {
	disableNextButton?: boolean;
	form?: FormInstance;
	stepNumber?: number;
	tabIndex?: number;
	title: string;
	subTitle?: string;
	formFields?: string[];
	errorOnTouchExtraFields?: string[];
	children: React.ReactChild | React.ReactChild[];
}

export const FormAccordion = ({
	children,
	enableAutoScroll,
	onComplete
}: FormAccordionProps) => {
	const [activePanel, setActivePanel] = useState(0);
	const ref = useRef<HTMLDivElement>(null);

	const onClickNext = useCallback(() => {
		if (activePanel < Children.count(children) - 1) {
			setActivePanel(activePanel + 1);
		} else {
			setActivePanel(null);
			onComplete?.();
		}
	}, [activePanel, children, onComplete]);

	const handlePanelClick = useCallback(
		(panel: number, isTabPressed: boolean) => {
			setActivePanel(
				activePanel === panel && !isTabPressed ? null : panel
			);
			if (enableAutoScroll) {
				const element = document.getElementById(`panel-${panel}`);
				const offsetPosition =
					element.getBoundingClientRect().top +
					window.pageYOffset -
					scrollOffset;

				window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
			}
		},
		[activePanel, enableAutoScroll]
	);
	const debouncedHandlePanelClick = useDebouncedCallback(
		handlePanelClick,
		200,
		{ leading: true, trailing: false }
	);

	return (
		<div className="formAccordionDigi" ref={ref}>
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
						handlePanelClick={debouncedHandlePanelClick}
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
	disableNextButton,
	tabIndex
}: FormAccordionItemProps & {
	index: number;
	isActive: boolean;
	handlePanelClick: (
		index: number,
		focusFirstElement?: boolean,
		onlyClose?: boolean
	) => void;
	handleNextStep: () => void;
}) => {
	const [id] = useState((Math.random() + 1).toString(36).substring(7));
	const formContext = React.useContext(FieldContext);
	const fieldsToCheck = [...formFields, ...errorOnTouchExtraFields];
	const isFieldsInValid = (form || formContext)
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
		<div
			className={`formAccordionDigi__Panel ${isActive ? 'active' : ''}`}
			id={`panel-${index}`}
		>
			<div
				className="formAccordionDigi__PanelHeader"
				onKeyDown={(e) => e.code === 'Space' && handlePanelClick(index)}
				onFocus={(ev) => {
					ev.preventDefault();
					ev.stopPropagation();

					handlePanelClick(index, true);
				}}
				onClick={() => handlePanelClick(index)}
				aria-controls={`content-${id}`}
				aria-expanded={isActive}
				tabIndex={0}
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
				aria-hidden={!isActive}
				id={`content-${id}`}
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
