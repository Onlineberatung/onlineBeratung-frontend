import * as React from 'react';
import { useContext } from 'react';
import { useConsultingTypes, UserDataContext } from '../../globalState';
import { handleNumericTranslation } from '../../utils/translate';
import { getUserDataTranslateBase } from './profileHelpers';
import { Headline } from '../headline/Headline';
import { Box as MuiBox, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const AskerConsultingTypeData = () => {
	const { t: translate } = useTranslation([
		'common',
		'consultingTypes',
		'agencies'
	]);
	const { userData } = useContext(UserDataContext);
	const consultingTypes = useConsultingTypes();

	return (
		<>
			{Object.values(userData.consultingTypes).map(
				(resort: any, index) =>
					resort.isRegistered &&
					resort.agency && (
						<MuiBox key={index} mb={3}>
							<Stack spacing={2}>
								<Headline
									text={translate(
										[
											`consultingType.${resort.agency.consultingType}.titles.default`,
											`consultingType.fallback.titles.default`,
											consultingTypes.find(
												(cur) =>
													cur.id ===
													resort.agency
														.consultingType
											)?.titles.default
										],
										{ ns: 'consultingTypes' }
									)}
									semanticLevel="5"
								/>
								{resort.sessionData &&
									Object.keys(resort.sessionData).map(
										(item, itemIndex) =>
											item === 'age' &&
											resort.sessionData[item] ===
												'null' ? null : (
												<Stack key={itemIndex} spacing={0.5}>
													<Typography variant="body2" color="text.secondary">
														{translate(
															'userProfile.data.' +
																item
														)}
													</Typography>
													<Typography variant="body1">
														{resort.sessionData[
															item
														]
															? translate(
																	handleNumericTranslation(
																		getUserDataTranslateBase(
																			parseInt(
																				resort
																					.agency
																					.consultingType
																			)
																		),
																		item,
																		resort
																			.sessionData[
																			item
																		]
																	)
																)
															: translate(
																	'profile.noContent'
																)}
													</Typography>
												</Stack>
											)
									)}
								<Stack spacing={0.5}>
									<Typography variant="body2" color="text.secondary">
										{translate('profile.data.agency.label')}
									</Typography>
									<Typography variant="body1">
										{translate(
											`agency.${resort.agency.id}.name`,
											{
												ns: 'agencies',
												defaultValue: resort.agency.name
											}
										)}{' '}
										<br />
										{resort.agency.postcode}
										{resort.agency.city
											? ' ' + resort.agency.city
											: ''}
									</Typography>
								</Stack>
							</Stack>
						</MuiBox>
					)
			)}
		</>
	);
};
