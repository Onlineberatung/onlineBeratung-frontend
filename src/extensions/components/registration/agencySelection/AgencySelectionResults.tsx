import {
	Typography,
	FormControlLabel,
	FormControl,
	Radio,
	RadioGroup,
	Box,
	Button,
	Link
} from '@mui/material';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import NoResultsIllustration from '../../../../resources/img/illustrations/no-results.svg';
import ConsultantIllustration from '../../../../resources/img/illustrations/consultant-found.svg';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Loading } from '../../../../components/app/Loading';
import { useTranslation } from 'react-i18next';
import { RegistrationContext } from '../../../../globalState';
import { AgencyDataInterface } from '../../../../globalState/interfaces';
import { AgencyLanguages } from './AgencyLanguages';
import { parsePlaceholderString } from '../../../../utils/parsePlaceholderString';
import { useAppConfig } from '../../../../hooks/useAppConfig';
import { VFC } from 'react';
import { MetaInfo } from '../metaInfo/MetaInfo';
import { REGISTRATION_DATA_VALIDATION } from '../registrationDataValidation';

interface AgencySelectionResultsProps {
	isLoading?: boolean;
	zipcode?: string;
	results?: AgencyDataInterface[];
	nextStepUrl: string;
	onNextClick(): void;
}

export const AgencySelectionResults: VFC<AgencySelectionResultsProps> = ({
	isLoading,
	zipcode,
	results,
	nextStepUrl,
	onNextClick
}) => {
	const { t } = useTranslation();
	const settings = useAppConfig();
	const {
		setDisabledNextButton,
		setDataForSessionStorage,
		sessionStorageRegistrationData,
		isConsultantLink
	} = useContext(RegistrationContext);

	const [agencyId, setAgencyId] = useState<number>(
		sessionStorageRegistrationData?.agencyId
	);

	useEffect(() => {
		if (
			// only external agencies
			results?.length > 0 &&
			results?.every((agency) => agency.external)
		) {
			setAgencyId(undefined);
			setDisabledNextButton(true);
			setDataForSessionStorage({
				agencyId: undefined
			});
			return;
		}
		if (
			// only one agency
			results?.length === 1 &&
			results?.every((agency) => !agency.external)
		) {
			setAgencyId(results[0].id);
			setDisabledNextButton(false);
			setDataForSessionStorage({
				agencyId: results[0].id
			});
			return;
		}
		if (
			// invalid agencyId, needs to be removed
			agencyId &&
			results?.length === 0
		) {
			setDisabledNextButton(true);
			setDataForSessionStorage({
				agencyId: undefined
			});
			return;
		}
		if (
			// valid agencyId
			REGISTRATION_DATA_VALIDATION.agencyId.validation(
				agencyId?.toString()
			)
		) {
			setDisabledNextButton(false);
			setDataForSessionStorage({
				agencyId: agencyId
			});
			return;
		}
	}, [
		agencyId,
		results,
		setDataForSessionStorage,
		setDisabledNextButton,
		zipcode
	]);

	return (
		<>
			{isLoading && (
				<Box
					sx={{
						mt: '80px',
						width: '100%',
						display: 'flex',
						justifyContent: 'center'
					}}
				>
					<Loading />
				</Box>
			)}
			{!!results && !isLoading && !isConsultantLink && (
				<Typography variant="h5" sx={{ mt: '40px', fontWeight: '600' }}>
					{t('registration.agency.result.headline') + ' ' + zipcode}:
				</Typography>
			)}
			{/* only external results */}
			{results?.length > 0 &&
				results?.every((agency) => agency.external) && (
					<Box
						sx={{
							display: 'flex',
							flexWrap: { xs: 'wrap-reverse', md: 'nowrap' },
							justifyContent: 'space-between',
							alignItems: 'center',
							p: '16px',
							mt: '16px',
							borderRadius: '4px',
							border: '1px solid #c6c5c4'
						}}
					>
						<Box sx={{ mr: { xs: '0', md: '24px' } }}>
							<Typography variant="h5" sx={{ fontWeight: '600' }}>
								{t(
									'registration.agency.result.external.headline'
								)}
							</Typography>
							<Typography sx={{ mt: '16px' }}>
								{t(
									'registration.agency.result.external.subline'
								)}
							</Typography>
							{results?.[0]?.url && (
								<Button
									target="_blank"
									component={Link}
									href={results?.[0]?.url}
									sx={{
										mt: '16px',
										width: { xs: '100%', md: 'auto' }
									}}
									variant="contained"
									startIcon={<OpenInNewIcon />}
								>
									{t(
										'registration.agency.result.external.link'
									)}
								</Button>
							)}
						</Box>
						<Box
							component="img"
							src={ConsultantIllustration}
							sx={{
								height: '156px',
								width: '156px',
								mx: 'auto',
								mb: { xs: '24px', md: '0' }
							}}
						/>
					</Box>
				)}
			{/* no Results */}
			{results?.length === 0 && (
				<Box
					sx={{
						display: 'flex',
						flexWrap: { xs: 'wrap-reverse', md: 'nowrap' },
						justifyContent: 'space-between',
						alignItems: 'center',
						p: '16px',
						mt: '16px',
						borderRadius: '4px',
						border: '1px solid #c6c5c4'
					}}
				>
					<Box sx={{ mr: { xs: '0', md: '24px' } }}>
						<Typography variant="h5" sx={{ fontWeight: '600' }}>
							{t('registration.agency.noresult.headline')}
						</Typography>
						<Typography sx={{ mt: '16px' }}>
							{t('registration.agency.noresult.subline')}
						</Typography>
						<Button
							sx={{
								mt: '16px',
								width: { xs: '100%', md: 'auto' }
							}}
							variant="contained"
							startIcon={<OpenInNewIcon />}
							target="_blank"
							component={Link}
							// TODO: Add fallback URL from Tenant
							href={
								settings?.postcodeFallbackUrl
									? parsePlaceholderString(
											settings.postcodeFallbackUrl,
											{
												url: 'https://fallbackURL.de',
												postcode: zipcode
											}
										)
									: 'https://fallbackURL.de'
							}
						>
							{t('registration.agency.noresult.label')}
						</Button>
					</Box>
					<Box
						component="img"
						src={NoResultsIllustration}
						sx={{
							height: '156px',
							width: '156px',
							mx: 'auto',
							mb: { xs: '24px', md: '0' }
						}}
					/>
				</Box>
			)}
			{/* one Result */}
			{results?.length === 1 &&
				!results?.every((agency) => {
					return agency.external;
				}) && (
					<FormControl sx={{ width: '100%' }}>
						<RadioGroup
							aria-label="agency-selection-radio-group"
							name="agency-selection-radio-group"
							defaultValue={results?.[0].name || ''}
						>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									width: '100%',
									mt: '16px'
								}}
							>
								<FormControlLabel
									disabled
									sx={{ alignItems: 'flex-start' }}
									value={results?.[0].name || ''}
									control={
										<Radio
											color="default"
											checkedIcon={
												<TaskAltIcon color="info" />
											}
											icon={<TaskAltIcon />}
										/>
									}
									label={
										<Box sx={{ mt: '10px', ml: '10px' }}>
											<Typography variant="body1">
												{results?.[0].name || ''}
											</Typography>
											<Typography
												variant="body2"
												sx={{
													color: 'info.light',
													mt: '8px'
												}}
											>
												{t(
													'registration.agency.result.languages'
												)}
											</Typography>
											<AgencyLanguages
												agencyId={results?.[0].id}
											/>
										</Box>
									}
								/>
								{results?.[0].description && (
									<MetaInfo
										headline={results?.[0].name}
										description={results?.[0].description}
										onOverlayClose={() =>
											setAgencyId(undefined)
										}
										backButtonLabel={t(
											'registration.agency.infoOverlay.backButtonLabel'
										)}
										nextButtonLabel={t(
											'registration.agency.infoOverlay.nextButtonLabel'
										)}
										nextStepUrl={nextStepUrl}
										onNextClick={onNextClick}
										onOverlayOpen={() => {
											setDataForSessionStorage({
												agencyId: results?.[0].id
											});
											setAgencyId(results?.[0].id);
										}}
									/>
								)}
							</Box>
						</RadioGroup>
					</FormControl>
				)}
			{/* more Results */}
			{results?.length > 1 &&
				!results?.every((agency) => agency.external) && (
					<FormControl sx={{ width: '100%' }}>
						<RadioGroup
							aria-label="agency-selection-radio-group"
							name="agency-selection-radio-group"
						>
							{results?.map((agency, index) => (
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										width: '100%',
										mt: index === 0 ? '16px' : '32px'
									}}
								>
									<FormControlLabel
										onClick={(e) => {
											setDisabledNextButton(false);
											setAgencyId(agency.id);
											setDataForSessionStorage({
												agencyId: agency.id
											});
										}}
										sx={{
											alignItems: 'flex-start'
										}}
										value={agency.id}
										control={
											<Radio
												checked={agencyId === agency.id}
											/>
										}
										label={
											<Box
												sx={{
													mt: '10px',
													ml: '10px'
												}}
											>
												<Typography variant="body1">
													{agency.name}
												</Typography>
												<Typography
													variant="body2"
													sx={{
														color: 'info.light',
														mt: '8px'
													}}
												>
													{t(
														'registration.agency.result.languages'
													)}
												</Typography>

												<AgencyLanguages
													agencyId={agency.id}
												/>
											</Box>
										}
									/>
									{agency.description && (
										<MetaInfo
											headline={agency.name}
											description={agency.description}
											onOverlayClose={() =>
												setAgencyId(undefined)
											}
											backButtonLabel={t(
												'registration.agency.infoOverlay.backButtonLabel'
											)}
											nextButtonLabel={t(
												'registration.agency.infoOverlay.nextButtonLabel'
											)}
											nextStepUrl={nextStepUrl}
											onNextClick={onNextClick}
											onOverlayOpen={() => {
												setDataForSessionStorage({
													agencyId: agency.id
												});
												setAgencyId(agency.id);
											}}
										/>
									)}
								</Box>
							))}
						</RadioGroup>
					</FormControl>
				)}
		</>
	);
};
