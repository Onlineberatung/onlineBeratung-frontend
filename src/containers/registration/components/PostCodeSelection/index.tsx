import React from 'react';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { VALID_POSTCODE_LENGTH } from '../../../../components/agencySelection/agencySelectionHelpers';
import { Text } from '../../../../components/text/Text';
import { PinIcon } from '../../../../resources/img/icons';

interface PostCodeSelectionArgs {
	isPreselectedAgency: boolean;
	value: string;
	onChange: (value: string) => void;
	onKeyDown?: (ev: KeyboardEvent) => void;
	disabled?: boolean;
}

export const PostCodeSelection = ({
	isPreselectedAgency,
	value,
	onChange,
	onKeyDown,
	disabled = false
}: PostCodeSelectionArgs) => {
	const { t: translate } = useTranslation(['common', 'agencies']);

	const introItemsTranslations = isPreselectedAgency
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
		<div className={'postCodeContainer'}>
			<div className="agencySelection__intro">
				<Text
					text={
						isPreselectedAgency
							? translate(
									'registration.agencyPreselected.intro.overline'
								)
							: translate(
									'registration.agencySelection.intro.overline'
								)
					}
					type="standard"
				/>
				<div className="agencySelection__intro__content">
					<Text
						text={
							isPreselectedAgency
								? translate(
										'registration.agencyPreselected.intro.subline'
									)
								: translate(
										'registration.agencySelection.intro.subline'
									)
						}
						type="standard"
					/>
					<ul>
						{introItemsTranslations.map(
							(introItemTranslation, i) => (
								<li key={introItemTranslation}>
									<Text
										text={translate(introItemTranslation)}
										type="standard"
									/>
								</li>
							)
						)}
					</ul>
				</div>
			</div>
			<div className="agencySelection__inputContainer">
				<TextField
					name="postcode"
					id="postcode"
					type="number"
					label={translate('registration.agencySelection.postcode.label')}
					value={value ?? ""}
					onChange={(e) => onChange(e.target.value)}
					onKeyDown={onKeyDown as any}
					disabled={disabled}
					fullWidth
					variant="outlined"
					autoComplete="off"
					inputProps={{
						maxLength: VALID_POSTCODE_LENGTH,
						pattern: '^[0-9]+$'
					}}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<PinIcon />
							</InputAdornment>
						)
					}}
					sx={{ mt: 2 }}
				/>
			</div>
		</div>
	);
};
