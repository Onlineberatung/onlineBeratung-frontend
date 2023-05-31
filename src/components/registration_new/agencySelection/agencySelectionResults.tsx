import {
	Typography,
	FormControlLabel,
	FormControl,
	Radio,
	RadioGroup,
	Box,
	Tooltip,
	Button,
	Link
} from '@mui/material';
import * as React from 'react';
import InfoIcon from '@mui/icons-material/Info';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import NoResultsIllustration from '../../../resources/img/illustrations/no-results.svg';
import ConsultantIllustration from '../../../resources/img/illustrations/consultant-found.svg';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Loading } from '../../app/Loading';
import { useTranslation } from 'react-i18next';
import { AgencyDataInterface } from '../../../globalState';
import { AgencyLanguages } from './agencyLanguages';
import { parsePlaceholderString } from '../../../utils/parsePlaceholderString';
import { useAppConfig } from '../../../hooks/useAppConfig';

interface AgencySelectionResultsProps {
	isLoading?: boolean;
	zipcode?: string;
	results?: AgencyDataInterface[];
}

export const AgencySelectionResults = ({
	isLoading,
	zipcode,
	results
}: AgencySelectionResultsProps) => {
	const { t: translate } = useTranslation();
	const settings = useAppConfig();

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
					<Loading></Loading>
				</Box>
			)}
			{results !== undefined && !isLoading && (
				<Typography variant="h5" sx={{ mt: '40px', fontWeight: '600' }}>
					{translate('registration.agency.result.headline') +
						' ' +
						zipcode}
					:
				</Typography>
			)}
			{/* only external results */}
			{results?.every((agency) => {
				return agency.external;
			}) && (
				<>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							p: '16px',
							mt: '16px',
							borderRadius: '4px',
							border: '1px solid #c6c5c4'
						}}
					>
						<Box sx={{ mr: '24px' }}>
							<Typography variant="h5" sx={{ fontWeight: '600' }}>
								{translate(
									'registration.agency.result.external.headline'
								)}
							</Typography>
							<Typography sx={{ mt: '16px' }}>
								{translate(
									'registration.agency.result.external.subline'
								)}
							</Typography>
							{results?.[0].url && (
								<Button
									target="_blank"
									component={Link}
									href={results?.[0].url}
									sx={{ mt: '16px' }}
									variant="contained"
									startIcon={<OpenInNewIcon />}
								>
									{translate(
										'registration.agency.result.external.link'
									)}
								</Button>
							)}
						</Box>
						<Box
							component="img"
							src={ConsultantIllustration}
							sx={{ height: '156px', width: '156px' }}
						></Box>
					</Box>
				</>
			)}
			{/* no Results */}
			{results?.length === 0 && (
				<>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							p: '16px',
							mt: '16px',
							borderRadius: '4px',
							border: '1px solid #c6c5c4'
						}}
					>
						<Box sx={{ mr: '24px' }}>
							<Typography variant="h5" sx={{ fontWeight: '600' }}>
								{translate(
									'registration.agency.noresult.headline'
								)}
							</Typography>
							<Typography sx={{ mt: '16px' }}>
								{translate(
									'registration.agency.noresult.subline'
								)}
							</Typography>
							<Button
								sx={{ mt: '16px' }}
								variant="contained"
								startIcon={<OpenInNewIcon />}
								target="_blank"
								component={Link}
								// TODO: Add fallback URL from Tenant
								href={parsePlaceholderString(
									settings.postcodeFallbackUrl,
									{
										url: 'https://fallbackURL.de',
										postcode: zipcode
									}
								)}
							>
								{translate(
									'registration.agency.noresult.label'
								)}
							</Button>
						</Box>
						<Box
							component="img"
							src={NoResultsIllustration}
							sx={{ height: '156px', width: '156px' }}
						></Box>
					</Box>
				</>
			)}
			{/* one Result */}
			{results?.length === 1 && (
				<>
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
												{translate(
													'registration.agency.result.languages'
												)}
											</Typography>
											<AgencyLanguages
												agencyId={results?.[0].id}
											></AgencyLanguages>
										</Box>
									}
								/>
								{results?.[0].description && (
									<Tooltip
										title={results[0].description}
										arrow
									>
										<InfoIcon
											sx={{
												p: '9px',
												width: '38px',
												height: '38px'
											}}
										></InfoIcon>
									</Tooltip>
								)}
							</Box>
						</RadioGroup>
					</FormControl>
				</>
			)}
			{/* more Results */}
			{results?.length > 1 &&
				!results?.every((agency) => {
					return agency.external;
				}) && (
					<>
						<FormControl sx={{ width: '100%' }}>
							<RadioGroup
								aria-label="agency-selection-radio-group"
								name="agency-selection-radio-group"
							>
								{results?.map((agency, index) => {
									return (
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'space-between',
												width: '100%',
												mt:
													index === 0
														? '16px'
														: '32px'
											}}
										>
											<FormControlLabel
												sx={{
													alignItems: 'flex-start'
												}}
												value={agency.name}
												control={<Radio />}
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
															{translate(
																'registration.agency.result.languages'
															)}
														</Typography>

														<AgencyLanguages
															agencyId={agency.id}
														></AgencyLanguages>
													</Box>
												}
											/>
											{agency.description && (
												<Tooltip
													title={agency.description}
													arrow
												>
													<InfoIcon
														sx={{
															p: '9px',
															width: '38px',
															height: '38px'
														}}
													></InfoIcon>
												</Tooltip>
											)}
										</Box>
									);
								})}
							</RadioGroup>
						</FormControl>
					</>
				)}
		</>
	);
};
