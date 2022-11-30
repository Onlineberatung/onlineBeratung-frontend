import * as React from 'react';
import './editableData.styles';
import { Text } from '../text/Text';
import clsx from 'clsx';
import { ReactComponent as CrossMarkIcon } from '../../resources/img/icons/x.svg';
import { ReactComponent as TrashIcon } from '../../resources/img/icons/trash.svg';
import { ReactComponent as PenIcon } from '../../resources/img/icons/pen.svg';
import { useEffect, useState } from 'react';
import { isStringValidEmail } from '../registration/registrationHelpers';
import { useTranslation } from 'react-i18next';

export interface EditableDataProps {
	label: string;
	type: 'text' | 'email';
	initialValue?: string;
	isDisabled?: boolean;
	isSingleEdit?: boolean;
	onSingleEditActive?: Function;
	onValueIsValid?: Function;
	isEmailAlreadyInUse?: boolean;
	isSingleClearable?: boolean;
	onSingleClear?: Function;
	onSingleFocus?: Function;
	onBeforeRemoveButtonClick?: (callback) => void;
}

export const EditableData = ({
	isDisabled,
	isSingleEdit,
	isSingleClearable,
	initialValue,
	onValueIsValid,
	isEmailAlreadyInUse,
	onSingleEditActive,
	onSingleClear,
	label: initialLabel,
	type,
	onSingleFocus,
	onBeforeRemoveButtonClick
}: EditableDataProps) => {
	const { t: translate } = useTranslation();
	const [inputValue, setInputValue] = useState<string>(initialValue ?? '');
	const [isValid, setIsValid] = useState<boolean>(true);
	const [label, setLabel] = useState<string>();
	const inputFieldRef = React.useRef<HTMLInputElement>(null);

	const handleSingleEditActive = () => {
		setInputValue(initialValue ?? '');
		onSingleEditActive();
	};

	useEffect(() => {
		if (!isDisabled) {
			if (!isSingleEdit) {
				return;
			}
			inputFieldRef.current.focus();
			inputFieldRef.current.select();
			return;
		}

		setInputValue(initialValue ?? translate('profile.noContent'));
		setIsValid(true);
		setLabel(initialLabel);
	}, [isDisabled, initialLabel, initialValue, isSingleEdit, translate]);

	useEffect(() => {
		if (!onValueIsValid) {
			return;
		}

		if (isValid) {
			onValueIsValid(inputValue);
		} else if (!isValid) {
			onValueIsValid(null);
		}
	}, [inputValue, isValid, onValueIsValid]);

	useEffect(() => {
		if (isEmailAlreadyInUse) {
			setIsValid(false);
			setLabel(translate('furtherSteps.email.overlay.input.unavailable'));
		}
	}, [isEmailAlreadyInUse, translate]);

	const handleFocus = (event) => {
		event.target.select();
		if (onSingleFocus) onSingleFocus();
	};

	const handleInputValueChange = (event) => {
		const { value } = event.target;
		setInputValue(value);

		if (type === 'email') {
			handleEmailValidation(value);
		} else {
			setIsValid(value.length > 0);
		}
	};

	const handleEmailValidation = (email) => {
		if (email.length > 0 && isStringValidEmail(email)) {
			setIsValid(true);
			setLabel(initialLabel);
		} else {
			setIsValid(false);
			setLabel(translate('furtherSteps.email.overlay.input.invalid'));
		}
	};

	const handleRemoveButtonClick = () => {
		const clearInput = () => {
			setInputValue('');
			setIsValid(false);
			inputFieldRef.current.focus();
		};
		if (onBeforeRemoveButtonClick) {
			onBeforeRemoveButtonClick(clearInput);
		} else {
			clearInput();
		}
	};

	return (
		<div className="editableData">
			<label
				className={clsx({
					'editableData__label--invalid': !isValid
				})}
				htmlFor={initialLabel}
			>
				<Text text={label} type="infoSmall" />
			</label>
			<input
				className={clsx('editableData__input', {
					'editableData__input--empty': !initialValue && isDisabled
				})}
				ref={inputFieldRef}
				type={type}
				onFocus={handleFocus}
				id={initialLabel}
				name={initialLabel}
				value={inputValue}
				onChange={handleInputValueChange}
				disabled={isDisabled}
			/>
			{!isDisabled && (
				<span
					className="editableData__inputButton editableData__inputButton--remove"
					onClick={handleRemoveButtonClick}
				>
					<CrossMarkIcon
						title={translate('app.delete')}
						aria-label={translate('app.delete')}
					/>
				</span>
			)}
			{isSingleEdit && isDisabled && (
				<div className="editableData__inputButtonGroup">
					{isSingleClearable && initialValue && (
						<span
							className="editableData__inputButton editableData__inputButton--singleClear"
							onClick={() => onSingleClear()}
						>
							<TrashIcon />
						</span>
					)}
					<span
						className="editableData__inputButton editableData__inputButton--singleEdit"
						onClick={() => handleSingleEditActive()}
					>
						<PenIcon
							title={translate('profile.data.edit.button.edit')}
							aria-label={translate(
								'profile.data.edit.button.edit'
							)}
						/>
					</span>
				</div>
			)}
		</div>
	);
};
