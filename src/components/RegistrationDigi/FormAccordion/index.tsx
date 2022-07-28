import { FieldContext } from 'rc-field-form';
import React, { useCallback, useState, Children } from 'react';
import { InvalidIcon } from '../../../resources/img/icons';
import './formAccordion.styles.scss';

interface FormAccordionProps {
	children: React.ReactChild | React.ReactChild[];
}

interface FormAccordionItemProps {
	stepNumber?: number;
	title: string;
	subTitle?: string;
	formFields?: string[];
	errorOnTouchExtraFields?: string[];
	children: React.ReactChild | React.ReactChild[];
}

export const FormAccordion = ({ children }: FormAccordionProps) => {
	const [activePanel, setActivePanel] = useState(null);

	const handlePanelClick = useCallback(
		(panel: number) => {
			setActivePanel(activePanel === panel ? null : panel);
		},
		[activePanel]
	);

	return (
		<div className="formAccordionDigi">
			{Children.toArray(children).map((child, index) => {
				if ((child as JSX.Element).type.name !== 'FormAccordionItem') {
					console.error('FormAccordionItem expected');
				}

				return (
					<FormAccordionPanel
						key={index}
						index={index}
						handlePanelClick={handlePanelClick}
						isActive={activePanel === index}
						{...((child as JSX.Element)
							.props as FormAccordionItemProps)}
					/>
				);
			})}
		</div>
	);
};

export const FormAccordionPanel = ({
	stepNumber,
	title,
	subTitle,
	formFields = [],
	errorOnTouchExtraFields = [],
	children,
	handlePanelClick,
	isActive,
	index
}: FormAccordionItemProps & {
	index: number;
	isActive: boolean;
	handlePanelClick: (index: number) => void;
}) => {
	const formContext = React.useContext(FieldContext);
	const fieldsToCheck = [...formFields, ...errorOnTouchExtraFields];
	const isValid = !(
		formContext.isFieldsTouched(fieldsToCheck) &&
		formContext
			.getFieldsError(formFields)
			.some((error) => error.errors.length !== 0)
	);

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
				{children}
			</div>
		</div>
	);
};

export const FormAccordionItem = ({ children }: FormAccordionItemProps) => {
	return <div className="FormAccordionBody">{children}</div>;
};

FormAccordion.Item = FormAccordionItem;
